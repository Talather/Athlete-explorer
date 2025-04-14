function RightSection ({ isExpanded, selectedEvent, onClose }) {
  const renderEventContent = () => {
    if (!selectedEvent) return null;
    
    switch(selectedEvent.type) {
      case 'video':
        return (
          selectedEvent?.video_url && (
            <div className="mt-6 rounded-xl overflow-hidden border border-[#EEEEEE]">
              <video
                controls
                width="100%"
                height="auto"
                className="w-full object-cover"
              >
                <source src={selectedEvent.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )
        );
      
      case 'live_stream':
        return (
          selectedEvent?.live_stream_url && (
            <div className="mt-6 rounded-xl overflow-hidden relative">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedEvent.live_stream_url}
                  title="Livestream"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="bg-red-500 text-white px-3 py-1 rounded-full absolute top-2 right-2 z-30 text-sm font-medium">
                LIVE
              </div>
            </div>
          )
        );
      
      case 'contest':
        const currentDate = new Date();
        const contestEndDate = selectedEvent.contest_end_date ? new Date(selectedEvent.contest_end_date) : null;
        const isContestEnded = contestEndDate ? currentDate > contestEndDate : false;
        
        return (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <div className="text-center mb-6">
              <h3 className="font-bold text-lg mb-2">Upload Your Submission</h3>
              <p className="text-gray-600 mb-4">Participate in this contest by uploading your content below</p>
              <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-2">
                  {!isContestEnded ? (
                    <div className="text-center">
                      <div className="text-indigo-600 font-bold">Contest in progress</div>
                      <div className="text-sm text-gray-600">
                        {contestEndDate ? `Ends on: ${contestEndDate.toLocaleDateString()}` : 'No end date specified'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-red-500 font-bold">
                      Contest has ended
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 border border-indigo-100 mb-4">
  <label className="flex flex-col items-center justify-center cursor-pointer p-6 border-2 border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors relative">
    <input
      type="file"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      accept="image/*,video/*"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-10 h-10 text-indigo-400 mb-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
    <p className="text-indigo-600 font-medium">Click to upload</p>
    <p className="text-gray-500 text-sm">or drag and drop</p>
    <p className="text-gray-500 text-xs mt-1">Image or Video files only</p>
  </label>
</div>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition-all">
                Submit Entry
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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
            <h2 className="text-2xl text-black font-bold">{selectedEvent?.name}</h2>
            <p className="text-lg text-[#969494] mb-2">{selectedEvent?.description}</p>
          </div>

          {renderEventContent()}

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
