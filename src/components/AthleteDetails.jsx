import React, { useState, useRef } from "react";
import { supabase } from '../lib/supabase';
import { useProfiles } from "thirdweb/react";
import { client } from '../client';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";
import ReactCountryFlag from "react-country-flag"
import { getCountryFlagFromName } from "../utils/countries";

function AthleteDetails({ athlete, events, onEventClick, isBlurred, ownsNFT, openVideoPopup, search, setSearch, searchVisible }) {
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const { data: profiles } = useProfiles({ client });
  const { currency } = useSelector(state => state.settings);
  const [started, setStarted] = useState(false);

  const [videoUrl, setVideoUrl] = useState(athlete?.fto?.videoUrl || "https://nargvalmcrunehnemvpa.supabase.co/storage/v1/object/sign/Athlete/Villain%20LeBron%20did%20not%20forget.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdGhsZXRlL1ZpbGxhaW4gTGVCcm9uIGRpZCBub3QgZm9yZ2V0Lm1wNCIsImlhdCI6MTc0MTU5ODYyOCwiZXhwIjoxNzQ0MTkwNjI4fQ.LCNqKXp4xqfja0Ga7QdfeQ4Vk-ZEUjj5lq8tXSj5sqM");

  const videoRef = useRef(null)

  const handlePlay = () => {
    setStarted(true)
    // Ensure videoRef exists before playing
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error("Error playing video:", error))
    }
  }

  // console.log(currency);

  const handleSubscriptionPurchase = async () => {
    if (!athlete?.id || !profiles?.[0]?.details?.id) {
      toast.error('Please log in or signup and ensure all required information is available');
      return;
    }

    const userEmail = profiles[0]?.details.email ? profiles[0]?.details.email : "";
    let phoneNo = profiles[0]?.details.phone ? profiles[0]?.details.phone : "";
    if(profiles[0].type === "custom_auth_endpoint"){
      phoneNo = profiles[0]?.details.id.split(":")[1];
    }

    if (!userEmail && !phoneNo) {
      toast.error('Please provide either email or phone number to proceed');
      return;
    }

    setSubscriptionLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout-session', {
        body: {
          athleteId: athlete.id,
          userId: profiles[0].details.id,
          email: userEmail,
          phone: phoneNo,
          currencyCode: currency,
        }
      });
      console.log(data);
      console.log(error);

      if (error) {
        console.error('Error creating subscription checkout session:', error);
        throw new Error(error.message || 'Failed to create subscription checkout session');
      }

      if (!data || !data.sessionUrl) {
        throw new Error('No session URL received from the server');
      }

      // Redirect to Stripe checkout
      window.location.href = data.sessionUrl;

    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(`Subscription failed: ${error.message || 'Unknown error'}`);
    } finally {
      setSubscriptionLoading(false);
    }
  };



  // console.log(athlete);

  return (
    <div className={`w-full mr-[32px] lg:mr-0 h-full rounded-3xl overflow-y-auto relative
      ${isBlurred ? "blur-lg pointer-events-none" : ""}`}
    >
      <div className="h-2 primary-gradient z-40 rounded-t-3xl sticky top-0"></div>

      {searchVisible && (
        <div className='block sm:hidden absolute w-full px-3 top-3 z-30'>
          <input
            type='text'
            placeholder='Search athlete...'
            className="bg-white p-[10px] w-full rounded-2xl border outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {(athlete?.id) && (
        <div className="rounded-b-3xl overflow-hidden -mt-px
          h-[240px] relative border border-[#EEEEEE] mb-5"
        >
          {/* video cover start */}
          <div className='w-full h-full flex items-center justify-center'>
            <img src={athlete?.profilePicture} alt='cover' className='w-full h-full sm:size-[160px] sm:mt-3 lg:mt-0 lg:size-[220px] border sm:rounded-full object-cover object-center' />
          </div>

          <div className="sm:bg-white/40 z-10 absolute top-0 left-0 w-full h-full flex flex-col gap-2 justify-between sm:px-[2cqw] sm:py-[1.5cqw]">
            {/* pause and start video button */}
            {(athlete?.fto?.videoUrl) ?
              <button onClick={openVideoPopup} className='size-[55px] flex items-center justify-center
                  rounded-full z-[3] bg-black/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  text-[20px] text-white
                  transition-all duration-500 opacity-100 hover:scale-105'
              >
                ▶
              </button>
              : <></>}
            {/* pause and start video button */}

            {/* desktop design start */}
            <div className="hidden sm:flex justify-between items-start gap-3 @container">
              <div className="flex justify-between w-full items-start">

                <div className="space-y-1">
                  <div className="flex items-center gap-1 lg:gap-3">
                    {athlete?.profilePicture &&
                      <div className="size-[50px] rounded-full overflow-hidden">
                        <img src={athlete?.profilePicture} alt='cover' className='w-full h-full object-cover object-top' />
                      </div>
                    }

                    <div className="text-black font-bold text-2xl md:text-3xl leading-tight">
                      ${athlete?.fanTokenSymbol || "Fan Token Symbol"}
                    </div>

                  </div>
                  <div className="text-black text-[18px] md:text-[20px] leading-tight max-w-[25cqw] font-bold">
                    {athlete?.sport || "Athlete Sport"}
                  </div>
                </div>

                <div className="space-y-1 flex flex-col items-end">
                  <div className="flex items-center gap-3">
                    {athlete?.country &&
                      <div className="max-w-[60px] h-[40px] w-full overflow-hidden">
                        <ReactCountryFlag style={{ width: '100%', height: '100%', borderRadius: '5px' }} countryCode={getCountryFlagFromName(athlete.country)} svg />
                      </div>
                    }
                  </div>
                  <div className="text-black text-[20px] leading-tight max-w-[25cqw] font-bold">
                    {athlete?.dayOfTheWeek || "Athlete dayOfTheWeek"}
                  </div>
                </div>

              </div>
            </div>
            {/* desktop design end */}

            {/* mobile design start */}
            <div className='sm:hidden bg-black/40 w-full 
              absolute top-0 px-4 py-2
              flex items-start justify-between'
            >
              {athlete.fanTokenSymbol &&
                <div className="text-[4cqw] font-bold text-white">
                  $ {athlete.fanTokenSymbol}
                </div>
              }

              {athlete?.country &&
                <div className="max-w-[25px] w-full ml-auto overflow-hidden">
                  <ReactCountryFlag style={{ width: '100%', height: '100%', borderRadius: '2px' }} countryCode={getCountryFlagFromName(athlete.country)} svg />
                </div>
              }

            </div>

            <div className='sm:hidden bg-black/40 w-full 
              absolute bottom-0 px-4 py-2'
            >
              <div className='flex gap-1 items-center justify-between'>
                {athlete?.dayOfTheWeek &&
                  <div className="text-white text-[4cqw] leading-tight font-bold">
                    {athlete?.dayOfTheWeek || "Athlete dayOfTheWeek"}
                  </div>
                }
                {athlete?.sport &&
                  <div className="text-white text-[4cqw] leading-tight font-bold">
                    {athlete?.sport}
                  </div>
                }
              </div>
            </div>
            {/* mobile design end */}
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
                    rounded-2xl sm:rounded-3xl overflow-hidden min-h-[9.4cqw] py-3 px-4 sm:px-8 sm:py-6 shadow-sm 
                    flex items-start flex-col gap-1 text-start"
                >
                  <div className="flex items-start gap-2 justify-between w-full">
                    <h3 className="line-clamp-1 font-bold text-base sm:text-[22px] leading-tight text-start">{event.name}</h3>

                    <div className="shrink-0 primary-gradient overflow-hidden p-0.5 rounded-[12px]
                      cursor-pointer text-white inline-block min-w-[80px] py-1 px-3 text-center"
                    >
                      {event.type}
                    </div>

                  </div>
                  <p className="line-clamp-1 text-[#969494] text-sm sm:text-lg">
                    {event.description}
                  </p>
                </button>
              </div>
            ))
          ) : (
            <div
              className={`min-h-[150px] bg-[#FCFCFC] border border-[#E7E7E7] shadow-sm
              rounded-3xl flex items-center justify-center text-[#C9C8C8] text-base leading-[1.25] sm:text-xl font-bold p-3 sm:p-6`}
            >
              <h2>
                {ownsNFT === true ? (
                  <div className="text-center flex flex-col items-center gap-1">
                    <span className="text-xl sm:text-3xl">⏳</span>
                    <span>
                      The first event of ${athlete?.fanTokenSymbol} will be posted soon!
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 @container">
                    <div className="text-center flex flex-col items-center gap-1">
                      <span className="text-xl sm:text-3xl">
                        🔒
                      </span>
                      <span>
                        You need at least one ${athlete?.fanTokenSymbol} token or a subscription to see these events.
                      </span>
                    </div>

                    {ownsNFT === true ? (
                      <></>
                    ) : (
                      <button
                        className="text-white py-2 px-4 sm:py-3 sm:px-4 text-sm sm:text-lg rounded-full leading-tight cursor-pointer
                          text-center shrink-0 primary-gradient min-w-[120px] sm:min-w-[180px]
                          font-bold transition-all duration-300 hover:bg-gray-100 mx-auto"
                        onClick={handleSubscriptionPurchase}
                        disabled={subscriptionLoading}
                      >
                        {subscriptionLoading ? 'Processing...' : 'Buy Subscription'}
                      </button>
                    )}

                  </div>
                )}
              </h2>
            </div>
          )}
        </div>
      ) : (
        <div
          className="-mt-2 h-full bg-[#FCFCFC] border border-[#E7E7E7] shadow-sm 
          rounded-3xl w-full flex items-center justify-center p-3 sm:p-6"
        >
          <div className="text-[#C9C8C8]">
            <h2 className="text-center font-bold text-xl sm:text-[28px]">
              Select an Athlete.
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default AthleteDetails;