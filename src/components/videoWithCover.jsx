import React, { useState, useRef } from 'react'
import '../styles/durhino.css'
import TimerOverlay from './timeOverlay'

const VideoWithCover = ({ coverImage, videoSrc , endDate }) => {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)

  const handlePlay = () => {
    setPlaying(true)
    videoRef.current.play()
  }

  return (
    <div className='video-wrapper'>
      {!playing && (
        <div className='video-cover' onClick={handlePlay}>
          <TimerOverlay  endDate={endDate}/>

          <img src={coverImage} alt='cover' className='cover-image' />
          <div className='play-button'>▶</div>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoSrc}
        className='video-element'
        controls
        style={{ display: playing ? 'block' : 'none' }}
      />
    </div>
  )
}

export default VideoWithCover
