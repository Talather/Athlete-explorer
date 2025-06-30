import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import FAQItem from "../components/FAQItem";
import RightSidebar from "../components/durhino_siderbar/code";
import "../styles/durhino.css";
import "../components/durhino_siderbar/style.css";
import VideoWithCover from "./videoWithCover";
import { supabase } from "./../lib/supabase";
import { getCountryFlagFromName } from "../utils/countries";
import ReactCountryFlag from "react-country-flag"
import Navbar from "./Navbar";
import { useStaticPages } from "../hooks/useStaticPages";
import { convertCurrency, formatCurrency } from "../utils/currencyConverter";

function DurinhoPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentFto, setCurrentFto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokensLeft, setTokensLeft] = useState(100);
  const [startDate, setStartDate] = useState(new Date(currentFto?.startDate))
  const [endDate, setEndDate] = useState(new Date(currentFto?.endDate))
  const [now, setNow] = useState(new Date());
  const [isBeforeStartDate, setIsBeforeStartDate] = useState(now < startDate);
  const [isAfterEndDate, setIsAfterEndDate] = useState(now > endDate);

  // Redux settings state
  const { currency, exchangeRates } = useSelector(state => state.settings);

  // Fetch FAQ data from database
  const { content: faqContent, loading: faqLoading, error: faqError } = useStaticPages('faq');

  useEffect(() => {
    setNow(new Date());
    fetchCurrentFto();
  }, []);

  // Helper function to convert and format price
  const getFormattedPrice = (priceInUSD) => {
    if (!priceInUSD) return '€0.00';
    const priceInEUR = priceInUSD; // Convert USD to EUR
    const convertedPrice = convertCurrency(priceInEUR, 'EUR', currency, exchangeRates);
    const formattedPrice = formatCurrency(convertedPrice, currency);
    return formattedPrice;
  };

  const fetchCurrentFto = async () => {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('Ftos')
      .select(`
        *,
        Atheletes (*)
      `)
      .eq('active', true)
      .single();

    setStartDate(data?.startDate)
    setEndDate(data?.endDate)
    setIsBeforeStartDate(now < data?.startDate);
    setIsAfterEndDate(now > data?.endDate);
    if (error) {
      console.error('Error fetching FTO:', error);
      return;
    }

    if (data) {
      setCurrentFto(data);
    }
    setLoading(false);
  };

  // Effect to disable body scrolling when overlay is active
  useEffect(() => {
    if (currentFto) {
      const now = new Date();
      const endDate = new Date(currentFto.endDate);
      const isAfterEndDate = now > endDate;

      if (!isAfterEndDate) {
        // Disable scrolling
        document.body.style.overflow = 'hidden';
      } else {
        // Enable scrolling
        document.body.style.overflow = 'auto';
      }

      // Cleanup function to restore scrolling
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [currentFto]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7]">
        {/* <img src="/sixer.gif" sizes="auto" alt="Logo" className="w-[120px] h-[120px] mb-4" />
        <div className="text-center">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-16 h-16 border-4 border-t-[#9352ee] border-r-[#e99289] border-b-[#9352ee] border-l-[#e99289] rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-[#1D1D1D] mb-2">Loading Fan Token Offering</h2>
            <p className="text-[#717071]">Please wait while we fetch the latest FTO data...</p>
          </div>
        </div> */}
      </div>
    );
  }

  if (!currentFto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7]">
        <img src="/sixer.gif" sizes="auto" alt="Logo" className="w-[120px] h-[120px] mb-4" />
        <div className="text-center">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-[#9352ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-[#1D1D1D] mb-2">No Active FTO Available</h2>
            <p className="text-[#717071] mb-4">There are currently no active Fan Token Offerings available. Please check back later for upcoming opportunities.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }


  // const isBeforeStartDate = now < startDate;
  // const isAfterEndDate = now > endDate;

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-r from-[#e99289] to-[#9352ee]
        text-white flex items-center justify-center 
          py-3 sm:py-4
          text-[24px] sm:text-[2.5vw] leading-normal font-semibold
      ">
        <h1>{currentFto.Atheletes.fanTokenSymbol}  Day (Round {currentFto.roundNumber})</h1>
      </div>

      {/* Main content with relative positioning for the overlay */}
      <div className="w-full relative">
        <div className="durinho-container 
          sm:px-[20px] sm:pt-[30px] pb-[60px]
          grid grid-cols-1 md:grid-cols-2 items-start gap-[20px]"
        >
          {/* Left: Video + Progress */}
          <div className="w-full">

            <div className="w-full">
              <VideoWithCover
                coverImage={currentFto.coverImageUrl}
                videoSrc={currentFto.videoUrl}
                isBeforeStartDate={isBeforeStartDate}
                startDate={currentFto.startDate}
                endDate={currentFto.endDate}
                onTimerEnd={() => {
                  fetchCurrentFto();
                }}
              />
            </div>

            <div className="px-[10px] pt-4 pb-5 sm:px-0">
              <div className="text-xs md:text-lg leading-normal font-[600]">
                Tokens left: {tokensLeft.toFixed(1)}%
              </div>

              <div class="relative h-[15px] w-full rounded-[20px]
                bg-gradient-to-b from-[#f1b371] to-[#9853ec]
                flex items-start p-0.5 overflow-hidden"
              >
                <div className="bg-white h-full w-full rounded-[20px]">
                  <div className="bg-gradient-to-b absolute top-0 left-0 from-[#f1b371] to-[#9853ec] h-full rounded-[10px]"
                    style={{ width: `${tokensLeft}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info Card */}
          <div className="px-[10px] sm:px-0">

            <div className="grid grid-cols-2 items-center">

              <div className="flex items-center justify-start gap-5">
                <div className="size-[51px] sm:size-[81px] rounded-full overflow-hidden shrink-0">
                  <img src={currentFto.Atheletes.profilePicture} alt={`${currentFto.Atheletes.firstName} ${currentFto.Atheletes.lastName}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-[#1D1D1D] leading-normal text-base sm:text-2xl font-bold">
                    ${currentFto.Atheletes.fanTokenSymbol}  <ReactCountryFlag countryCode={getCountryFlagFromName(currentFto.Atheletes.country)} svg />
                  </h2>
                  <p className="text-sm sm:text-lg text-[#717071] leading-normal font-[600]">{currentFto.Atheletes.sport}</p>
                </div>
              </div>

              <div className="">
                <div className="text-[#1D1D1D] text-end leading-normal text-base sm:text-2xl font-bold">
                  {new Date(currentFto.startDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
                </div>
                <div className="text-sm sm:text-lg text-end text-[#717071] leading-normal font-[600]">
                  Publication day
                </div>
              </div>

            </div>

            <div className="flex flex-col justify-center items-center py-[20px]">
              <h3 className="text-center text-[22px] sm:text-[33px] leading-normal font-bold text-[#1D1D1F]">
                {currentFto.Atheletes.firstName} {currentFto.Atheletes.nickName ? `"${currentFto.Atheletes.nickName}"` : ""} {currentFto.Atheletes.lastName}
              </h3>
              <p className="text-center text-[15px] sm:text-[18px] leading-normal font-bold text-[#717071]">
                {currentFto.Atheletes.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5 px-2">

              <div className="bg-[#ffffff7d] w-full rounded-[8px] 
                flex flex-col items-center px-2 py-5"
              >
                <strong className="text-[#1D1D1D] text-center leading-normal text-base sm:text-2xl font-bold">
                  {currentFto.tokensForSale} ${currentFto.Atheletes.fanTokenSymbol}
                </strong>
                <p className="text-sm sm:text-lg text-center text-[#717071] leading-normal font-[600]">
                  Tokens for sale
                </p>
              </div>

              <div className="bg-[#ffffff7d] w-full rounded-[8px] 
                flex flex-col items-center px-2 py-5"
              >
                <strong className="text-[#1D1D1D] text-center leading-normal text-base sm:text-2xl font-bold">
                  {new Date(currentFto.startDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </strong>
                <p className="text-sm sm:text-lg text-center text-[#717071] leading-normal font-[600]">
                  Start date
                </p>
              </div>
            </div>
            {isBeforeStartDate && (
              <div className="w-full p-4 ">
                <div className="text-center mb-3">
                  <h2 className="text-[#1D1D1D] text-lg font-bold">JOIN THE WAITLIST AND RECEIVE AN EMAIL WHEN THE SALE STARTS</h2>
                </div>
                <div className="flex flex-col  justify-center items-center gap-3 max-w-xl mx-auto">
                  <input
                    type="email"
                    placeholder="indicate@youremail.com"
                    className="w-full border border-gray-300 rounded-md p-3"
                  />
                  <button className="bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white font-bold py-3 px-8 rounded-full">
                    SUBMIT
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 items-center py-[1.25rem]">
              <h3
                className="price text-[23px] sm:text-[41px] flex justify-center"
              >
                {getFormattedPrice(currentFto.Atheletes.fanTokenInitialPrice)}
              </h3>
              <div className="flex items-center justify-center">
                <div className="fto-button-border-gradient">
                  <button
                    className="fto-button-wrappr"
                    onClick={() => {
                      if (!isBeforeStartDate) {
                        setShowSidebar(true)
                      }
                    }}
                  >
                    <span
                      className="button text-[17px] sm:text-[26px] px-[15px] py-[12px] sm:px-[22px] sm:py-[15px]"
                    >
                      {isBeforeStartDate ?
                        "COMING SOON" :
                        `Buy $${currentFto.Atheletes.fanTokenSymbol}`
                      }
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 md:px-[10px]">

              {/* Dynamic FAQ items from database */}
              {faqLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e99289]"></div>
                </div>
              ) : faqError ? (
                <div className="text-center text-red-500 py-4">
                  Failed to load FAQ content
                </div>
              ) : (
                faqContent?.content?.faqs?.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))
              )}

              {/* Fallback to hardcoded FAQ items if no database content */}
              {!faqLoading && !faqError && (!faqContent?.content?.faqs || faqContent.content.faqs.length === 0) && (
                <>
                  <FAQItem
                    question={`What is $${currentFto.Atheletes.fanTokenSymbol}?`}
                    answer={`${currentFto.Atheletes.fanTokenSymbol} is ${currentFto.Atheletes.firstName} ${currentFto.Atheletes.lastName}' fan token. By owning $${currentFto.Atheletes.fanTokenSymbol}, you will be able to engage with the athlete and other fan token holders, participate in contests, earn rewards, and vote in polls to influence significant decisions ${currentFto.Atheletes.firstName} has to make!`}
                  />

                  <FAQItem
                    question={`How do I buy $${currentFto.Atheletes.fanTokenSymbol}?`}
                    answer={`Click the Buy $${currentFto.Atheletes.fanTokenSymbol} button, enter your email, choose quantity, then either store in Winter wallet or your ETH wallet. Finally, pay with card.`}
                  />
                  <FAQItem
                    question="How do I participate in events?"
                    answer="Once the FTO ends, events will appear. You can join using your fan tokens. They're not consumed, so you can reuse them."
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for ended FTO */}
      {!isAfterEndDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center m-4">
            <div className="bg-gradient-to-r from-[#e99289] to-[#9352ee] h-[6px] w-1/3 rounded-full mx-auto mb-6"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-[#9352ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-[#1D1D1D] mb-3">This Sale Has Ended</h2>
            <p className="text-[#717071] mb-6">New events will be posted soon. Thank you for your interest!</p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      )}
      {/* --- RIGHT SIDEBAR --- */}
      <>
        <RightSidebar
          isOpen={showSidebar && !isAfterEndDate}
          currentFto={currentFto}
          onClose={() => setShowSidebar(false)}
        />
      </>
    </>
  );
}

export default DurinhoPage;
