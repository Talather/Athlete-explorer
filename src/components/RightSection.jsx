function RightSection ({ isExpanded, selectedEvent, onClose }) {
  return (
    <div className={`shrink-0 md:w-[200px] lg:w-[220px] xl:w-[300px] border border-[#E7E7E7] bg-white rounded-3xl 
      overflow-x-hidden overflow-y-auto py-5 px-6 ${isExpanded ? 'expanded' : ''}`}
    >
      {isExpanded ? (
        <>
          <div className='close-btn'  onClick={onClose}>
            ×
          </div>
          <div>
            <h2>{selectedEvent?.title}</h2>
            <p>{selectedEvent?.description}</p>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-full space-y-1">
          <h2 className="text-center text-[#C9C8C8] text-[28px] font-bold leading-tight">
            Select an Athlete and an Event.
          </h2>
          <p className="text-center text-[#C9C8C8] text-lg leading-tight">
            To see more information, select an athlete and an event first.
          </p>
        </div>
      )}
    </div>
  )
}

export default RightSection
