import { useRef, useState } from 'react';

export default function VideoPopup({ selectedAthlete, videoPopupClose }) {
  const videoRef = useRef(null);
  return (
    <div className="fixed inset-0 z-[999] px-2 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden">
      <div className="rounded-xl shadow-lg text-center w-full h-full flex items-center justify-center relative">
        <button onClick={videoPopupClose} className='close-btn absolute top-5 right-5 z-10'>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 1L1 19" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 1L19 19" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Video */}

        <div className='max-w-[800px] h-[500px] w-full bg-black'>
            <video
            ref={videoRef}
            autoPlay
            muted
            controls
            className="w-full h-full object-contain"
            >
            <source src={selectedAthlete?.fto?.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        </div>
      </div>
    </div>
  );
}
