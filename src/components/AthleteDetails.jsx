import React from "react";

function AthleteDetails({ athlete, events, onEventClick }) {
  console.log(events);
  return (
    <div className="w-full h-full shadow-sm rounded-3xl overflow-hidden">
      {/* Event List */}
      {athlete ? (
        <div className="h-full">
          {events.length > 0 ? (
            events.map((event, i) => (
              <div
                className="event-block"
                key={event.id || i}
                onClick={() => onEventClick(event)}
              >
                {event?.video_url && (
                  <div
                    key={athlete.id || event?.video_url}
                    className="video-container"
                  >
                    <video
                      autoPlay
                      muted
                      loop
                      controls
                      width="100%"
                      height="70%"
                    >
                      <source src={event?.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            ))
          ) : (
            <div
              className="h-full bg-[#FCFCFC] border border-[#E7E7E7] rounded-3xl 
              flex items-center justify-center text-[#C9C8C8] p-6 p-6 overflow-y-auto"
            >
              <h2
                style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}
              >
                This event will be available soon
              </h2>
            </div>
          )}
        </div>
      ) : (
        <div
          className="h-full bg-[#FCFCFC] border border-[#E7E7E7] 
          rounded-3xl w-full flex items-center justify-center p-6 overflow-y-auto"
        >
          <div className="text-[#C9C8C8]">
            <h2 className="text-center font-bold text-[28px]">
              Select an Athlete.
            </h2>
            <p className="text-center text-lg">
              To see more information, select an athlete first.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AthleteDetails;
