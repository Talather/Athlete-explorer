function AthleteDetails ({ athlete, events, onEventClick, isBlurred }) {
  return (
    <div className={`content-section ${isBlurred ? 'blurred' : ''}`}>
      <div className={`athlete-details ${athlete ? 'expanded' : ''}`}>
        {athlete ? (
          <>
            <div className='content'>
              <h2>{athlete.name}</h2>
              <p>{athlete.description}</p>
            </div>
            <video autoPlay muted loop>
              <source src={athlete.video_url} type='video/mp4' />
            </video>
          </>
        ) : (
          <div className='content'>
            <h2>Select an Athlete.</h2>
            <p>Click on an athlete to view the details.</p>
          </div>
        )}
      </div>

      {athlete && (
        <div className='event-section'>
          {events.map((event, i) => (
            <div
              className='event-block'
              key={i}
              onClick={() => onEventClick(event)}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AthleteDetails













// function AthleteDetails ({ athlete, events, onEventClick, isBlurred }) {
//   // Extract YouTube video ID
//   const getYoutubeId = url => {
//     if (!url) return null
//     const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
//     return match ? match[1] : null
//   }

//   const renderVideo = () => {
//     if (!athlete?.video_url) return null

//     const youtubeId = getYoutubeId(athlete.video_url)
//     const isYoutube = !!youtubeId

//     return isYoutube ? (
//       <div className='video-wrapper'>
//         <iframe
//           width='100%'
//           height='100%'
//           src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}`}
//           title='YouTube video player'
//           frameBorder='0'
//           allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
//           allowFullScreen
//         ></iframe>
//       </div>
//     ) : (
//       <video autoPlay muted loop controls width='100%' height='100%'>
//         <source src={athlete.video_url} type='video/mp4' />
//         Your browser does not support the video tag.
//       </video>
//     )
//   }

//   return (
//     <div className={`content-section ${isBlurred ? 'blurred' : ''}`}>
//       <div className={`athlete-details ${athlete ? 'expanded' : ''}`}>
//         {athlete ? (
//           <>
//             <div className='content'>
//               <h2>{athlete.name}</h2>
//               <p>{athlete.description}</p>
//             </div>
//             {renderVideo()}
//           </>
//         ) : (
//           <div className='content'>
//             <h2>Select an Athlete.</h2>
//             <p>Click on an athlete to view the details.</p>
//           </div>
//         )}
//       </div>

//       {athlete && (
//         <div className='event-section'>
//           {events.map((event, i) => (
//             <div
//               className='event-block'
//               key={i}
//               onClick={() => onEventClick(event)}
//             >
//               <h3>{event.title}</h3>
//               <p>{event.description}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default AthleteDetails










