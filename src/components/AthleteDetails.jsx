



import React from 'react'

function AthleteDetails ({ athlete, events, onEventClick, isBlurred }) {
  return (
    <div className={`content-section ${isBlurred ? 'blurred' : ''}`}>
      <div className={`athlete-details ${athlete ? 'expanded' : ''}`}>
        {athlete ? (
          <>
            {/* Athlete Info */}
            <div className='content'>
              <h2 style={{ fontFamily: 'Arial, sans-serif' }}>{athlete.name}</h2>
              <p style={{ fontFamily: 'Arial, sans-serif' }}>{athlete.description}</p>
            </div>

            {/* 🔄 Video with unique key wrapper to avoid DOM errors */}
            {athlete.video_url && (
              <div
                key={athlete.id || athlete.video_url}
                className='video-container'
              >
                <video autoPlay muted loop controls width='100%' height='100%'>
                  <source src={athlete.video_url} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </>
        ) : (
          <div className='content'>
            <h2 style={{ fontFamily: 'Arial, sans-serif' }}>Select an Athlete.</h2>
            <p style={{ fontFamily: 'Arial, sans-serif' }}>Click on an athlete to view the details.</p>
          </div>
        )}
      </div>

      {/* Event List */}
      {athlete && (
        <div className='event-section'>
          {events.map((event, i) => (
            <div
              className='event-block'
              key={event.id || i}
              onClick={() => onEventClick(event)}
            >
              <h3 style={{ fontFamily: 'Arial, sans-serif' }}>{event.title}</h3>
              <p style={{ fontFamily: 'Arial, sans-serif' }}>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AthleteDetails





