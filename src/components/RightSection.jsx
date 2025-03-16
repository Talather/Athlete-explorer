function RightSection ({ isExpanded, selectedEvent, onClose }) {
  return (
    <div className={`right-section ${isExpanded ? 'expanded' : ''}`}>
      {isExpanded ? (
        <>
          <div className='close-btn'  onClick={onClose}>
            ×
          </div>
          <div>
          <h2 style={{ fontFamily: 'Arial, sans-serif' }}>{selectedEvent?.title}</h2>
            <p style={{ fontFamily: 'Arial, sans-serif' }}>{selectedEvent?.description}</p>
            </div>
        </>
      ) : (
        <>
          <h2 style={{ fontFamily: 'Arial, sans-serif' }}>Select an Athlete and an Event.</h2>
          <p style={{ fontFamily: 'Arial, sans-serif' }}>Click on an event to participate.</p>
        </>
      )}
    </div>
  )
}

export default RightSection
