import React, { useState, useEffect } from "react";

function AthleteDetails({ athlete, events, onEventClick, isBlurred }) {
  


  return (
    <div className={`w-full h-full rounded-3xl overflow-y-auto
      ${isBlurred ? "blur-lg pointer-events-none" : ""}`}
    >
      { athlete?.video_url && (
            <div
              key={athlete.id || athlete?.video_url}
              className="rounded-3xl overflow-hidden h-[240px] relative border border-[#EEEEEE] mb-5"
            >
              <div className="h-2 primary-gradient z-20 rounded-t-3xl sticky top-0"></div>
              <video
                autoPlay
                muted
                loop
                width="100%"
                height="70%"
                className="w-full h-full object-cover"
              >
                <source src={athlete?.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="bg-white/40 absolute top-0 left-0 w-full h-full flex flex-col gap-2 justify-between px-[2cqw] py-[1.5cqw]">
                
                <div>
                  <div className="text-black font-bold text-[2cqw] leading-tight">
                    {athlete?.firstName || "Athlete Name"}
                  </div>
                  <div className="text-[#373737] text-[1.3cqw] leading-tight max-w-[25cqw] font-medium">
                    {athlete?.description || "Athlete description"}
                  </div>
                </div>

                <div className="flex items-center gap-[1.2cqw]">
                  <div className="bg-[#FAFAFB] border-[#EBEBEB] 
                    rounded-3xl leading-snug flex items-center flex-col justify-center
                    px-[1.5cqw] py-[1.2cqw] shadow-md text-center"
                  >
                    <div className="text-black font-bold text-[1.1cqw]">
                      1000 000 ${athlete?.firstName?.toUpperCase()}
                    </div>
                    <div className="text-[#969494] text-[1cqw]">
                      Tokens for sale
                    </div>
                  </div>

                  <div className="bg-[#FAFAFB] border-[#EBEBEB] 
                    rounded-3xl leading-snug flex items-center flex-col justify-center
                    px-[1.5cqw] py-[1.2cqw] shadow-md text-center"
                  >
                    <div className="text-black font-bold text-[1.1cqw]">
                      07/15/2023
                    </div>
                    <div className="text-[#969494] text-[1cqw]">
                      Tokens sale start date
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )
        }
      {/* Event List */}
      {athlete ? (
        <div 
          className="w-full"
        >
          {events.length > 0 ? (
            events.map((event, i) => (
              <div
                className="space-y-10 mb-5 @container"
                key={event.id || i}
              >
                
                <button onClick={() => onEventClick(event)}
                  className="w-full bg-[#FCFCFC] border border-[#EEEEEE] 
                    rounded-3xl overflow-hidden min-h-[9.4cqw] px-8 py-6 shadow-sm 
                    flex items-start flex-col"  
                >
                  <h3 className="font-bold text-[22px] leading-tight">{event.name}</h3>
                  <p className="text-[#969494] text-lg">{event.description}</p>
                  <p className="text-pink text-lg">{event.type}</p>
                </button>

              </div>
            ))
          ) : (
            <div
              className="h-[150px] bg-[#FCFCFC] border border-[#E7E7E7] shadow-sm
              rounded-3xl flex items-center justify-center text-[#C9C8C8] p-6 overflow-y-auto"
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
          className="h-full bg-[#FCFCFC] border border-[#E7E7E7] shadow-sm 
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