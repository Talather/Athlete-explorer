import { useCallback, useRef, useEffect } from 'react'

export function useChatScroll() {
  const containerRef = useRef(null)
  const isAutoScrollRef = useRef(true)

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
    isAutoScrollRef.current = true
  }, [])

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10
    isAutoScrollRef.current = isAtBottom
  }, [])

  // Auto-scroll when new messages arrive (only if user is at bottom)
  const scrollToBottomIfNeeded = useCallback(() => {
    if (isAutoScrollRef.current) {
      scrollToBottom()
    }
  }, [scrollToBottom])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return { 
    containerRef, 
    scrollToBottom, 
    scrollToBottomIfNeeded,
    isAutoScroll: isAutoScrollRef.current
  }
}
