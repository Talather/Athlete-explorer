function RightSection ({ isExpanded, selectedEvent, onClose }) {
  return (
    <div className={`right-section ${isExpanded ? 'expanded' : ''}`}>
      {isExpanded ? (
        <>
          <div className='close-btn' onClick={onClose}>
            ×
          </div>
          <h2>{selectedEvent?.title}</h2>
          <p>{selectedEvent?.description}</p>
        </>
      ) : (
        <>
          <h2>Select an Athlete and an Event.</h2>
          <p>Click on an event to participate.</p>
        </>
      )}
    </div>
  )
}

export default RightSection
