function RightSection ({ isExpanded, selectedEvent, onClose }) {
  return (
    <div className={`shrink-0 w-[300px] border border-[#E7E7E7] bg-white rounded-3xl 
      overflow-x-hidden overflow-y-auto py-5 px-6 ${isExpanded ? 'expanded' : ''}`}
    >
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
          <div className="absolute top-[50%]">
            <p style={{ fontFamily: 'Arial, sans-serif' }}>This event will be available soon.</p>
          </div>
        </>
      )}
    </div>
  )
}

export default RightSection
