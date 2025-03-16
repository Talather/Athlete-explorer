import React, { useEffect, useState } from 'react'

const TimerOverlay = () => {
  const saleEndTime = new Date('2025-03-18T23:59:59') // ✅ Make sure it's in the future!
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = saleEndTime - now

      if (diff <= 0) {
        clearInterval(interval)
        setTimeLeft('00:00:00')
      } else {
        const hours = String(
          Math.floor((diff / (1000 * 60 * 60)) % 24)
        ).padStart(2, '0')
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(
          2,
          '0'
        )
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
        setTimeLeft(`${hours}:${minutes}:${seconds}`)
      }
    }, 1000)

    return () => clearInterval(interval) // Cleanup
  }, [])

  return (
    <div
      className='timer-overlay'
      
    >
      The Sale ends in <strong>{timeLeft}</strong>
    </div>
  )
}

export default TimerOverlay
