function RightSection ({ isExpanded, selectedEvent, onClose }) {
  return (
    <div className={`shrink-0 border border-[#E7E7E7] bg-white rounded-3xl transition-all duration-300
      overflow-x-hidden overflow-y-auto py-5 px-6 relative
      ${isExpanded ? 'w-[50%] ml-[-28%]' : ' md:w-[200px] lg:w-[220px] xl:w-[300px]'}`}
    >
      {isExpanded ? (
        <>
        <div className="w-full text-end">
          <button className='close-btn'  onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 1L1 19" stroke="#0A0B0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 1L19 19" stroke="#0A0B0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

          <div>
            <h2 className="text-2xl text-black font-bold">{selectedEvent?.title}</h2>
            <p className="text-lg text-[#969494]">{selectedEvent?.description}</p>
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
