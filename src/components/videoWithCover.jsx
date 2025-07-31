import React, { useState, useRef } from 'react'
import '../styles/durhino.css'
import TimerOverlay from './timeOverlay'

const VideoWithCover = ({ coverImage, videoSrc, isBeforeStartDate, startDate, endDate, onTimerEnd }) => {
  const [started, setStarted] = useState(false) 
  const [paused, setPaused] = useState(false) 
  const videoRef = useRef(null)

  const handlePlay = () => {
    setStarted(true) 
    setPaused(false) 

    // Ensure videoRef exists before playing
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error("Error playing video:", error))
    }
  }

  const handlePause = () => {
    setPaused(true) 
  }

  return (
    <div className='relative bg-black/40 cursor-pointer h-[220px] xs:h-[450px] 2xl:h-[600px] sm:rounded-[30px] overflow-hidden'>
      
      <div className='absolute -top-[1px] sm:top-[1rem] right-0 sm:right-[1rem] z-10'>
        <TimerOverlay endDate={endDate} startDate={startDate} isBeforeStartDate={isBeforeStartDate} onTimerEnd={onTimerEnd} />
      </div>

      {/* Show cover image only before the video starts */}
      {!started && (
        <div className='video-cover' onClick={handlePlay}>
          <img src={coverImage} alt='cover' className='w-full h-full object-cover' />
          <button className='size-[55px] flex items-center justify-center
            rounded-full z-[3] bg-black/60 absolute text-[20px] text-white
            transition-all duration-500 opacity-100 hover:scale-105'
          >
            ▶
          </button>
        </div>
      )}

      {/* Video always remains visible after it starts */}
      {started && (
        <video
          ref={videoRef}
          src={videoSrc}
          className='block border-none w-full h-full object-contain bg-black'
          controls
          onPlay={() => setPaused(false)}
          onPause={handlePause}
          autoPlay
        />
      )}

      {/* Smoothly transition the play button when the video is paused */}
      {started && (
        <button 
          onClick={handlePlay}
          className={`size-[55px] flex items-center justify-center
            rounded-full z-[3] bg-black/60 absolute text-[20px] text-white
            transition-all duration-500 hover:scale-105 top-1/2 left-1/2 
            transform -translate-x-1/2 -translate-y-1/2 
            ${paused ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-90'}`}
        >
          ▶
        </button>
      )}
    </div>
  )
}

export default VideoWithCover
