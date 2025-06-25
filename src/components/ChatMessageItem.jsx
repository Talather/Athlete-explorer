import React from 'react'
import { Reply, Download, Loader2, Clock } from 'lucide-react'

const ChatMessageItem = ({ message, isOwnMessage, showHeader, onReply, currentUserId }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderFileContent = () => {
    if (message.message_type === 'image' || (message.file_url && message.file_type?.startsWith('image/'))) {
      return (
        <div className="mt-2 max-w-sm">
          <img
            src={message.file_url}
            alt={message.file_name || 'Image'}
            className={`rounded-lg max-w-full h-auto cursor-pointer transition-opacity ${
              message.sending ? 'opacity-70' : 'hover:opacity-90'
            }`}
            // onClick={() => !message.sending && window.open(message.file_url, '_blank')}
            loading="lazy"
          />
          {/* {message.file_name && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {message.file_name}
            </p>
          )} */}
        </div>
      )
    }

    if (message.message_type === 'file' || (message.file_url && !message.file_type?.startsWith('image/'))) {
      return (
        <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {message.file_name}
              </p>
              {message.file_size && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(message.file_size)}
                </p>
              )}
            </div>
            {!message.sending && (
              <button
                onClick={() => handleDownload(message.file_url, message.file_name)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="Download file"
              >
                <Download size={16} className="text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
        </div>
      )
    }

    return null
  }

  const renderReplyContent = () => {
    if (!message.reply_to) return null

    return (
      <div className="mb-2 pl-3 border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900 rounded-r-lg p-2">
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
          {message.reply_to.username}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
          {message.reply_to.message_type === 'image' ? '📷 Image' :
           message.reply_to.message_type === 'file' ? '📎 File' :
           message.reply_to.content}
        </p>
      </div>
    )
  }
  

  return (
    <div className={`flex gap-3 px-4 py-2 group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
      message.sending ? 'opacity-70' : ''
    }`}>
      {/* Avatar placeholder */}
      {showHeader && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
          style={{ background: message?.profilePicture?'transparent':'linear-gradient(65deg, #EB9486, #8F4FF3)' }}>
            {message?.profilePicture ? (
              <img src={message?.profilePicture} alt="Profile" className="w-full h-full rounded-full" />
            ) : (
              message.username?.[0]?.toUpperCase() || 'U'
            )}
        </div>
      )}
      
      {/* Message content */}
      <div className={`flex-1 min-w-0 ${!showHeader ? 'ml-11' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Header with username and timestamp */}
            {showHeader && (
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {message.username}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(message.created_at)}
                </span>
                {message.sending && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock size={12} />
                    <span>Sending...</span>
                  </div>
                )}
              </div>
            )}

            {/* Reply content */}
            {renderReplyContent()}

            {/* Message text */}
            {message.content && message.content.trim() && (
              <div className="text-sm text-gray-900 dark:text-gray-100 break-words">
                {message.content}
              </div>
            )}

            {/* File content */}
            {renderFileContent()}

            {/* Loading indicator for sending messages */}
            {message.sending && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Loader2 size={12} className="animate-spin" />
                <span>Uploading...</span>
              </div>
            )}
          </div>

          {/* Actions on the right side */}
          {!message.sending && !isOwnMessage && (
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <button
                onClick={() => onReply(message)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Reply"
                style={{ background: 'linear-gradient(65deg, #EB9486, #8F4FF3)' }}
              >
                <Reply size={14} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessageItem
