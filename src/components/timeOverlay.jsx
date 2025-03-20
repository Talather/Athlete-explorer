import React, { useEffect, useState } from 'react'

const TimerOverlay = ({endDate}) => {
  const [timeLeft, setTimeLeft] = useState('')
  const updateTimeRemaining = () => {
    const now = new Date();
    const endDated = new Date(endDate);
    const diff = endDated - now;

    if (diff <= 0) {
      setTimeLeft(null);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let formattedTime = "";
    if (days > 0) {
      formattedTime += `${days}d `;
    }
    formattedTime += `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      setTimeLeft(formattedTime);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      
      updateTimeRemaining()
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
