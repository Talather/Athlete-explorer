import React, { useState, useRef } from "react";
import { supabase } from '../lib/supabase';
import { useProfiles } from "thirdweb/react";
import { client } from '../client';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";
import ReactCountryFlag from "react-country-flag"
import { getCountryFlagFromName } from "../utils/countries";

function AthleteDetails({ athlete, events, onEventClick, isBlurred, ownsNFT }) {
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const { data: profiles } = useProfiles({ client });
  const { currency } = useSelector(state => state.settings);
  const [started, setStarted] = useState(false);

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
    if (!athlete?.id || !profiles?.[0]?.details?.id || !profiles?.[0]?.details?.email) {
      toast.error('Please connect your wallet and ensure all required information is available');
      return;
    }

    setSubscriptionLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout-session', {
        body: {
          athleteId: athlete.id,
          userId: profiles[0].details.id,
          email: profiles[0].details.email,
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
    <div className={`w-full h-full rounded-3xl overflow-y-auto
      ${isBlurred ? "blur-lg pointer-events-none" : ""}`}
    >
      {athlete?.video_url && (
        <div
          key={athlete.id || athlete?.video_url}
          className="rounded-3xl overflow-hidden h-[240px] relative border border-[#EEEEEE] mb-5"
        >
          <div className="h-2 primary-gradient z-20 rounded-t-3xl sticky top-0"></div>

          {started &&
            <video
              ref={videoRef}
              autoPlay
              muted
              width="100%"
              height="70%"
              className="w-full h-full object-cover"
              onEnded={() => {
                setStarted(false);
              }}
            >
              <source src={athlete?.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          }

          {/* video cover start */}

          {!started &&
            <div className='video-cover w-full h-full'>
              <img src={athlete?.profilePicture} alt='cover' className='w-full h-full object-cover object-center' />
            </div>
          }

          <div className="bg-white/40 z-10 absolute top-0 left-0 w-full h-full flex flex-col gap-2 justify-between px-[2cqw] py-[1.5cqw]">

            {/* pause and start video button */}

            {!started &&
              <button onClick={handlePlay} className='size-[55px] flex items-center justify-center
                  rounded-full z-[3] bg-black/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  text-[20px] text-white
                  transition-all duration-500 opacity-100 hover:scale-105'
              >
                ▶
              </button>
            }
            {/* pause and start video button */}

            <div className="flex justify-between items-start gap-3">
              <div className="flex justify-between w-full items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    {athlete?.profilePicture && 
                      <div className="size-[50px] rounded-full overflow-hidden">
                        <img src={athlete?.profilePicture} alt='cover' className='w-full h-full object-cover' />
                      </div>
                    }

                    <div className="text-black font-bold text-[2cqw] leading-tight">
                      {athlete?.fanTokenSymbol || "Fan Token Symbol"}
                    </div>
                  </div>
                  <div className="text-black text-[1.3cqw] leading-tight max-w-[25cqw] font-bold">
                    {athlete?.sport || "Athlete Sport"}
                  </div>
                </div>

                <div className="space-y-1 flex flex-col items-end">
                  <div className="flex items-center gap-3">
                    {athlete?.country && 
                      <div className="max-w-[60px] h-[40px] w-full overflow-hidden">
                          <ReactCountryFlag style={{width: '100%', height: '100%' , borderRadius: '5px'}} countryCode={getCountryFlagFromName(athlete.country)} svg />
                      </div>
                    }
                  </div>
                  <div className="text-black text-[1.3cqw] leading-tight max-w-[25cqw] font-bold">
                    {athlete?.dayOfTheWeek || "Athlete dayOfTheWeek"}
                  </div>
                </div>

              </div>
              {ownsNFT === true ? (
                <></>
              ) : (
                <button
                  className="text-white shrink-0 p-3 rounded-xl text-[1cqw] bg-black leading-tight max-w-[25cqw] font-medium"
                  onClick={handleSubscriptionPurchase}
                  disabled={subscriptionLoading}
                >
                  {subscriptionLoading ? 'Processing...' : 'Buy Subscription'}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-[1.2cqw]">
              <div className="bg-[#FAFAFB] border-[#EBEBEB] 
                    rounded-3xl leading-snug flex items-center flex-col justify-center
                    px-[1.5cqw] py-[1.2cqw] shadow-md text-center"
              >
                <div className="text-black font-bold text-[1.1cqw]">
                  {athlete?.totalNoOfFanTokens} ${athlete?.firstName?.toUpperCase()}
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
                {ownsNFT === true ? (
                  "This event will be posted soon."
                ) : (
                  "You do not have a $XXX NFT or subscription. Get your NFT or subscription to access this area."
                )}
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