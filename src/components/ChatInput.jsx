import React, { useState, useRef, useCallback } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { Send, Paperclip, Smile, X, Reply, Upload, Image, File, Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
const ChatInput = ({ onSendMessage, onSendFile, replyTo, onCancelReply, disabled = false }) => {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const inputRef = useRef(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const createFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  const handleFileSelect = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    createFilePreview(file)
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSend = async () => {
    if ((!message.trim() && !selectedFile) || disabled || isUploading) return

    setIsUploading(true)
    
    try {
      if (selectedFile) {
        // Send file with optional text
        await onSendFile(selectedFile, replyTo?.id, message.trim())
        clearSelectedFile()
      } else {
        // Send text only
        await onSendMessage(message.trim(), replyTo?.id)
      }
      
      setMessage('')
      onCancelReply?.()
      setShowEmojiPicker(false)
    } catch (error) {
      console.error('ChatInput: Failed to send:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true)
    }
  }, [])

  const handleDragOut = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  // Replace emoji shortcuts in text
  const processMessage = (text) => {
    return text
      .replace(':)', '😊')
      .replace(':(', '😞')
      .replace(':D', '😃')
      .replace('<3', '❤️')
      .replace(':P', '😛')
  }

  return (
    <div className="relative">
      {/* Drag and drop overlay */}
      {dragActive && (
        <div className="absolute inset-0 bg-opacity-20 border-2 border-dashed rounded-lg flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(235, 148, 134, 0.2)',
            borderColor: '#EB9486'
          }}>
          <div className="text-center">
            <Upload size={48} className="mx-auto mb-2" style={{ color: '#8F4FF3' }} />
            <p className="font-medium" style={{ color: '#8F4FF3' }}>Drop file to attach</p>
          </div>
        </div>
      )}

      <div
        className="p-4 space-y-3"
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Reply indicator */}
        {replyTo && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-l-4" 
            style={{ 
              background: 'linear-gradient(65deg, rgba(235, 148, 134, 0.1), rgba(143, 79, 243, 0.1))',
              borderLeftColor: '#EB9486'
            }}>
            <Reply size={16} style={{ color: '#8F4FF3' }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium" style={{ color: '#8F4FF3' }}>Replying to {replyTo.username}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {replyTo.message_type === 'image' ? '📷 Image' : 
                 replyTo.message_type === 'file' ? '📎 File' : 
                 replyTo.content}
              </p>
            </div>
            <button
              onClick={onCancelReply}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
            >
              <X size={14} style={{ color: '#EB9486' }} />
            </button>
          </div>
        )}

        {/* File preview */}
        {selectedFile && (
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {filePreview ? (
                <div className="relative">
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded flex items-center justify-center">
                    <Image size={16} className="text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                  <File size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={clearSelectedFile}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              disabled={isUploading}
            >
              <X size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-center gap-3">
          {/* Text input with emoji button */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(processMessage(e.target.value))}
              onKeyPress={handleKeyPress}
              placeholder={selectedFile ? "Add a message (optional)..." : "Type a message..."}
              disabled={disabled || isUploading}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '120px',
                resize: 'none'
              }}
            />
            
            {/* Emoji button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled || isUploading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <Smile size={18} />
            </button>
          </div>

          {/* File upload button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center w-10 h-10"
            >
              <Paperclip size={20} />
            </button>
          </div>

          {/* Send button */}
          <div className="flex items-center">
            <button
              onClick={handleSend}
              disabled={(!message.trim() && !selectedFile) || disabled || isUploading}
              className="p-2 hover:opacity-90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center w-10 h-10"
              style={{ 
                background: (!message.trim() && !selectedFile) || disabled || isUploading ? undefined : 'linear-gradient(65deg, #EB9486, #8F4FF3)'
              }}
            >
              {isUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
          accept="image/*,video/*"
        />

        {/* Emoji picker overlay */}
        {showEmojiPicker && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowEmojiPicker(false)}
            style={{ pointerEvents: 'all' }}
          />
        )}

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 right-4 z-50">
            <div className="relative">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                height={350}
                width={300}
                previewConfig={{ showPreview: false }}
                skinTonesDisabled
                searchDisabled
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInput
