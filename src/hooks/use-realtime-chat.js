import { supabase } from '../lib/supabase.js';
import { useCallback, useEffect, useState, useRef } from 'react'

export function useRealtimeChat({ eventId, username, userId }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [channel, setChannel] = useState(null)
  const offsetRef = useRef(0)
  const messagesRef = useRef([])
  const MESSAGES_LIMIT = 20

  // Keep ref in sync with state
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Load initial messages
  const loadMessages = useCallback(async (offset = 0, isInitial = false) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          reply_to:reply_to_id (
            id,
            username,
            content,
            message_type
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .range(offset, offset + MESSAGES_LIMIT - 1)

      if (error) throw error

      const sortedMessages = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

      if (isInitial) {
        setMessages(sortedMessages)
      } else {
        setMessages(prev => [...sortedMessages, ...prev])
      }

      setHasMore(data.length === MESSAGES_LIMIT)
      offsetRef.current = offset + data.length
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  // Load more messages (for pagination)
  const loadMoreMessages = useCallback(() => {
    if (!hasMore || loading) return
    setLoading(true)
    loadMessages(offsetRef.current, false)
  }, [hasMore, loading, loadMessages])

  // Set up real-time subscription
  useEffect(() => {
    if (!eventId || !userId) return

    console.log('Setting up real-time subscription for event:', eventId)

    const channelName = `event-chat-${eventId}`
    const newChannel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'new_message' }, async (payload) => {
        console.log('Broadcast message received:', payload)
        const messageData = payload.payload
        
        // Don't process our own messages
        if (messageData.user_id === userId) {
          console.log('Skipping own broadcast message')
          return
        }
        
        console.log('Processing broadcast message from other user:', messageData)
        
        // Add the message directly or fetch full data if needed
        if (messageData.reply_to_id) {
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              reply_to:reply_to_id (
                id,
                username,
                content,
                message_type
              )
            `)
            .eq('id', messageData.id)
            .single()
          
          if (data) {
            setMessages(current => [...current, data])
          }
        } else {
          setMessages(current => [...current, messageData])
        }
      })
      .subscribe(async (status, error) => {
        console.log('Subscription status:', status, error)
        setIsConnected(true);

        if (status === 'SUBSCRIBED') {
          console.log("Successfully subscribed to channel:", channelName)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Channel error:', error);
          setIsConnected(false)
        } else if (status === 'TIMED_OUT') {
          console.error('Subscription timed out')
          setIsConnected(false)
        } else if (status === 'CLOSED') {
          console.log('Channel closed')
          setIsConnected(false)
        }
      })

    setChannel(newChannel)

    // Load initial messages
    loadMessages(0, true)

    return () => {
      console.log('Cleaning up subscription for channel:', channelName)
      supabase.removeChannel(newChannel)
    }
  }, [eventId, userId, loadMessages])

  // Send text message
  const sendMessage = useCallback(async (content, replyToId = null , profile) => {
    if (!content.trim() || !eventId) return



    // Create optimistic message
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      event_id: eventId,
      user_id: userId,
      username: username,
      content: content.trim(),
      message_type: replyToId ? 'reply' : 'text',
      reply_to_id: replyToId,
      created_at: new Date().toISOString(),
      sending: true,
      profilePicture: profile?.profilePicture? profile?.profilePicture : null,
    }

    // Add optimistic message immediately
    setMessages(current => [...current, optimisticMessage])

    try {
      const messageData = {
        event_id: eventId,
        user_id: userId,
        username: username,
        content: content.trim(),
        message_type: replyToId ? 'reply' : 'text',
        reply_to_id: replyToId,
        profilePicture: profile?.profilePicture? profile?.profilePicture : null,
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select(`
          *,
          reply_to:reply_to_id (
            id,
            username,
            content,
            message_type
          )
        `)
        .single()

      if (error) throw error

      // Replace optimistic message with real one
      setMessages(current => 
        current.map(msg => 
          msg.id === optimisticMessage.id ? { ...data, sending: false } : msg
        )
      )

      // Also broadcast the message for real-time updates
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'new_message',
          payload: data
        })
      }

      return data
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove failed optimistic message
      setMessages(current => 
        current.filter(msg => msg.id !== optimisticMessage.id)
      )
      throw error
    }
  }, [eventId, userId, username, channel])

  // Send file message
  const sendFileMessage = useCallback(async (file, replyToId = null, messageText = '' , profile) => {
    if (!file || !eventId) return


    // Create optimistic message
    const isImage = file.type.startsWith('image/')
    const optimisticFileUrl = URL.createObjectURL(file)
    
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      event_id: eventId,
      user_id: userId,
      username: username,
      content: messageText || (isImage ? '' : ''),
      message_type: replyToId ? 'reply' : (isImage ? 'image' : 'file'),
      file_url: optimisticFileUrl,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      reply_to_id: replyToId,
      created_at: new Date().toISOString(),
      sending: true,
      profilePicture: profile?.profilePicture? profile?.profilePicture : null,
    }

    // Add optimistic message immediately
    setMessages(current => [...current, optimisticMessage])

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `chat-files/${eventId}/${fileName}`
      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('athletes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('athletes')
        .getPublicUrl(filePath)

      // Determine message type and content
      const messageType = replyToId ? 'reply' : (isImage ? 'image' : 'file')
      const content = messageText || (isImage ? '' : '')

      const messageData = {
        event_id: eventId,
        user_id: userId,
        username: username,
        content: content,
        message_type: messageType,
        file_url: publicUrl,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        profilePicture: profile?.profilePicture? profile?.profilePicture : null,
        reply_to_id: replyToId
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select(`
          *,
          reply_to:reply_to_id (
            id,
            username,
            content,
            message_type
          )
        `)
        .single()

      if (error) throw error

      // Clean up optimistic file URL
      URL.revokeObjectURL(optimisticFileUrl)

      // Replace optimistic message with real one
      setMessages(current => 
        current.map(msg => 
          msg.id === optimisticMessage.id ? { ...data, sending: false } : msg
        )
      )

      // Also broadcast the message for real-time updates
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'new_message',
          payload: data
        })
      }

      return data
    } catch (error) {
      console.error('Error sending file:', error)
      // Clean up optimistic file URL
      URL.revokeObjectURL(optimisticFileUrl)
      // Remove failed optimistic message
      setMessages(current => 
        current.filter(msg => msg.id !== optimisticMessage.id)
      )
      throw error
    }
  }, [eventId, userId, username, channel])

  return {
    messages,
    loading,
    hasMore,
    isConnected,
    sendMessage,
    sendFileMessage,
    loadMoreMessages
  }
}
