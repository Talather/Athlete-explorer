import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Loader2, ChevronUp, Wifi, WifiOff, ChevronDown } from 'lucide-react'
import ChatMessageItem from './ChatMessageItem'
import ChatInput from './ChatInput'
import { useRealtimeChat } from '../hooks/use-realtime-chat'
import { useProfiles , useActiveWallet } from "thirdweb/react";
import { useSelector } from 'react-redux'
const EventChat = ({ event }) => {
  const {
      profile,
      loading: userLoading,
      error: userError,
      uploadingPicture,
      uploadError
    } = useSelector(state => state.user);
  const wallet = useActiveWallet();
  const address = wallet?.getAccount().address;
  const profiles = useProfiles(address);
  const currentUserId = profiles.data[0].details.id; 
  const [replyTo, setReplyTo] = useState(null)
  const [showLoadMore, setShowLoadMore] = useState(true)
  const username = profile?.username ? profile.username : profile?.email? profile.email:profile?.phone ? profile.phone : profiles.data[0].details.id;
  // Chat hooks
  const {
    messages,
    loading,
    hasMore,
    isConnected,
    sendMessage,
    sendFileMessage,
    loadMoreMessages
  } = useRealtimeChat({
    eventId: event?.id,
    username: username, 
    userId:currentUserId,
  })

  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [newMessagesCount, setNewMessagesCount] = useState(0)
  const [previousMessageCount, setPreviousMessageCount] = useState(0)

  // Check if user is at bottom of chat
  const checkIfAtBottom = () => {
    if (!messagesContainerRef.current) return true
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const threshold = 100 // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold
  }

  // Handle scroll events
  const handleScroll = () => {
    const atBottom = checkIfAtBottom()
    setIsAtBottom(atBottom)
    
    if (atBottom) {
      setNewMessagesCount(0)
    }
  }

  // Auto-scroll to bottom
  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'instant'
      })
    }
  }

  // Handle new messages
  useEffect(() => {
    const currentMessageCount = messages.length
    
    if (currentMessageCount > previousMessageCount && previousMessageCount > 0) {
      if (isAtBottom) {
        // User is at bottom, auto-scroll
        setTimeout(() => scrollToBottom(), 100)
      } else {
        // User scrolled up, increment new messages counter
        setNewMessagesCount(prev => prev + (currentMessageCount - previousMessageCount))
      }
    }
    
    setPreviousMessageCount(currentMessageCount)
  }, [messages.length, isAtBottom, previousMessageCount])

  // Initial scroll to bottom
  useEffect(() => {
    if (messages.length > 0 && previousMessageCount === 0) {
      setTimeout(() => scrollToBottom(false), 100)
    }
  }, [messages.length, previousMessageCount])

  const handleSendMessage = async (content, replyToId) => {
    try {
      await sendMessage(content, replyToId , profile)
      // Always scroll to bottom when user sends a message
      setTimeout(() => scrollToBottom(), 100)
    } catch (error) {
      console.error('EventChat: Failed to send message:', error)
    }
  }

  const handleSendFile = async (file, replyToId, messageText) => {
    try {
      await sendFileMessage(file, replyToId, messageText , profile)
      // Always scroll to bottom when user sends a file
      setTimeout(() => scrollToBottom(), 100)
    } catch (error) {
      console.error('EventChat: Failed to send file:', error)
    }
  }

  const handleReply = (message) => {
    setReplyTo(message)
  }

  const handleCancelReply = () => {
    setReplyTo(null)
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadMoreMessages()
    }
  }

  const handleScrollToNewMessages = () => {
    scrollToBottom()
    setNewMessagesCount(0)
  }

  // Group messages by sender and time proximity
  const groupedMessages = messages.reduce((groups, message, index) => {
    const prevMessage = messages[index - 1]
    const showHeader = !prevMessage || 
      prevMessage.user_id !== message.user_id ||
      new Date(message.created_at) - new Date(prevMessage.created_at) > 5 * 60 * 1000 // 5 minutes

    groups.push({
      ...message,
      showHeader
    })
    return groups
  }, [])

  if (!event) {
    return (
      <div className="h-[75vh] flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <MessageCircle size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">No Event Selected</p>
          <p className="text-sm text-gray-400">Select an event to start chatting with other fans</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[70vh] max-w-[600px] w-full flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 primary-gradient">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full">
            <MessageCircle className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{event.name}</h3>
            <p className="text-xs text-white text-opacity-90">Event Discussion</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isConnected 
              ? 'bg-green-500 bg-opacity-20 text-white backdrop-blur-sm' 
              : 'bg-red-500 bg-opacity-20 text-white backdrop-blur-sm'
          }`}>
            {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1 bg-gray-50 dark:bg-gray-900 chat-scrollbar"
        style={{ minHeight: 0 }}
      >
        {/* Load more button */}
        {showLoadMore && (
          <div className="flex justify-center py-3">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-full transition-colors disabled:opacity-50 border border-gray-200 shadow-sm"
              style={{
                background: loading ? undefined : 'linear-gradient(65deg, #EB9486, #8F4FF3)',
                color: loading ? undefined : 'white',
                border: loading ? undefined : 'none'
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ChevronUp size={16} />
              )}
              <span className="font-medium">Load more messages</span>
            </button>
          </div>
        )}

        {/* Loading indicator for initial load */}
        {loading && messages.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" 
                style={{ background: 'linear-gradient(65deg, #EB9486, #8F4FF3)' }}>
                <Loader2 size={24} className="animate-spin text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Loading messages...</p>
            </div>
          </div>
        )}

        {/* No messages state */}
        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(65deg, #EB9486, #8F4FF3)' }}>
                <MessageCircle size={32} className="text-white" />
              </div>
              <p className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">Start the conversation!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to share your thoughts about this event</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {groupedMessages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            isOwnMessage={message.user_id === currentUserId}
            showHeader={message.showHeader}
            onReply={handleReply}
            currentUserId={currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* New messages indicator */}
      {newMessagesCount > 0 && (
        <div className="flex justify-center py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleScrollToNewMessages}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:opacity-90 rounded-full transition-all shadow-sm"
            style={{ background: 'linear-gradient(65deg, #EB9486, #8F4FF3)' }}
          >
            <ChevronDown size={16} />
            <span className="font-medium">{newMessagesCount} new message{newMessagesCount > 1 ? 's' : ''}</span>
          </button>
        </div>
      )}

      {/* Chat input */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile}
          replyTo={replyTo}
          onCancelReply={handleCancelReply}
          disabled={!isConnected}
        />
      </div>
    </div>
  )
}

export default EventChat