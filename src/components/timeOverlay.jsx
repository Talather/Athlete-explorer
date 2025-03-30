import React, { useEffect, useState } from 'react'

const TimerOverlay = ({endDate, startDate, isBeforeStartDate, onTimerEnd}) => {
  const [timeLeft, setTimeLeft] = useState('')


  const updateTimeRemaining = () => {
    const now = new Date();

    const endDated = new Date(isBeforeStartDate?startDate:endDate);
    const diff = endDated - now;

    if (diff <= 0) {
      setTimeLeft(null);
      // Call the callback function when the timer ends
      if (onTimerEnd && typeof onTimerEnd === 'function') {
        onTimerEnd();
      }
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
    // Initial check without waiting for the first interval
    updateTimeRemaining();
    
    const interval = setInterval(() => {
      updateTimeRemaining();
    }, 1000)

    return () => clearInterval(interval) // Cleanup
  }, [endDate, startDate, isBeforeStartDate, onTimerEnd])

  return (
    <div
      className='text-white bg-[#565353a8] inline-block 
       rounded-bl-[10px] sm:rounded-[10px] 
       sm:min-w-[290px] 
       pl-1 pr-2 sm:px-[10px] py-1 
       text-[13px] sm:text-[20px] leading-normal font-[300]'
    >
      {isBeforeStartDate ? 'The sale will start in' : 'The sale will end in'} <strong className='font-bold'>{timeLeft}</strong>
    </div>
  )
}

export default TimerOverlay
