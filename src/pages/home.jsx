import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAthletes, fetchAthleteEvents, setSelectedEvent, clearSelectedEvent, setEvents, setSelectedAthlete } from "../store/slices/athleteSlice";
import { fetchUserSubscriptions } from "../store/slices/subscriptionSlice";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AthleteDetails from "../components/AthleteDetails";
import RightSection from "../components/RightSection";
import StickyBar from "../components/StickyBar";
import Footer from "../components/Footer";
import MobileOnlyPage from "../components/mobileHome";
import { useWalletBalance } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import { client } from "../client";
import { useProfiles, useActiveWallet } from "thirdweb/react";
import { userOwnsNFT } from "./../utils/userOwnsNft";
// import { userHasSubscription } from "./../utils/userHasSubscription";

import toast from 'react-hot-toast';
import EventChat from "../components/EventChat";
import VideoPopup from "../components/VideoPopup";
import SEO from "../components/SEO";

function Home() {

  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const wallet = useActiveWallet();
  const address = wallet?.getAccount().address;
  const { userSubscriptions } = useSelector(state => state.subscriptions);
  const { data: profiles } = useProfiles({ client });
  const dispatch = useDispatch();
  const {
    athletes,
    selectedAthlete,
    events,
    selectedEvent,
    isExpanded,
    loading,
    error
  } = useSelector(state => state.athletes);

  const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [athletesWithAccess, setAthletesWithAccess] = useState([]);

  const chatPopupOpen = () => {
    setIsChatPopupOpen(true);
    document.body.style.overflow = 'hidden';
  }

  const chatPopupClose = () => {
    setIsChatPopupOpen(false);
    document.body.style.overflow = 'auto';
  }

  const videoPopupOpen = () => {
    setIsVideoPopupOpen(true);
    document.body.style.overflow = 'hidden';
  }

  const videoPopupClose = () => {
    setIsVideoPopupOpen(false);
    document.body.style.overflow = 'auto';
  }

  useEffect(() => {
    dispatch(fetchAthletes());
  }, [dispatch]);

  useEffect(() => {

  }, [profiles]);
  const handleSelectAthlete = async (athlete) => {
    if (!address) {
      toast.error("Please log in or signup to continue", {
        icon: '🔒',
        duration: 3000
      });
      return;
    }
    // Check if user has an active subscription for this athlete
    const hasActiveSubscription = userSubscriptions?.some(
      subscription => subscription.athleteId === athlete.id && subscription.active === true
    );

    if (hasActiveSubscription) {
      console.log("HAS SUBSCRIPTION")
      dispatch(fetchAthleteEvents({ ...athlete, ownsNFT: true, hasSubscription: true }));
      return;
    }


    if (!athlete.nftContractAddress) {
      console.log("NO CONTRACT")
      dispatch(setSelectedAthlete({
        ...athlete,
        video_url: "https://nargvalmcrunehnemvpa.supabase.co/storage/v1/object/sign/Athlete/Villain%20LeBron%20did%20not%20forget.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdGhsZXRlL1ZpbGxhaW4gTGVCcm9uIGRpZCBub3QgZm9yZ2V0Lm1wNCIsImlhdCI6MTc0MTU5ODYyOCwiZXhwIjoxNzQ0MTkwNjI4fQ.LCNqKXp4xqfja0Ga7QdfeQ4Vk-ZEUjj5lq8tXSj5sqM"
      }));
      dispatch(setEvents([]));
      return;
    }
    const ownsNFT = await userOwnsNFT(
      athlete.nftContractAddress,
      address
    );
    if (ownsNFT) {
      dispatch(fetchAthleteEvents({ ...athlete, ownsNFT: true }));
      return;
    }
    else {
      dispatch(setSelectedAthlete({
        ...athlete,
        video_url: "https://nargvalmcrunehnemvpa.supabase.co/storage/v1/object/sign/Athlete/Villain%20LeBron%20did%20not%20forget.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdGhsZXRlL1ZpbGxhaW4gTGVCcm9uIGRpZCBub3QgZm9yZ2V0Lm1wNCIsImlhdCI6MTc0MTU5ODYyOCwiZXhwIjoxNzQ0MTkwNjI4fQ.LCNqKXp4xqfja0Ga7QdfeQ4Vk-ZEUjj5lq8tXSj5sqM"
      }));
      dispatch(setEvents([]));
    }
    console.log("You do not own this athlete's NFT");

    // Dispatch the fetchAthleteEvents action when an athlete is selected
  };

  const handleEventClick = (event) => {
    dispatch(setSelectedEvent(event));
  };

  const handleClose = () => {
    dispatch(clearSelectedEvent());
  };

  // console.log("Selected Athlete: ",selectedAthlete);

  useEffect(() => {
    const enhanceAthletes = async () => {
      if (!address || !athletes.length) return;

      const enhanced = await Promise.all(athletes.map(async (athlete) => {
        const isValidContract = /^0x[a-fA-F0-9]{40}$/.test(athlete.nftContractAddress);
        const ownsNFT = isValidContract
          ? await userOwnsNFT(athlete.nftContractAddress, address)
          : false;

        const hasSubscription = userSubscriptions?.some(
          sub => sub.athleteId === athlete.id && sub.active
        );

        return {
          ...athlete,
          hasAccess: ownsNFT || hasSubscription
        };
      }));

      setAthletesWithAccess(enhanced);
    };

    enhanceAthletes();
  }, [athletes, address, userSubscriptions]);



  return (
      <div className="h-[100vh] w-full relative">
      <SEO
        title="Fansday – NFT Fan Pass & Exclusive Athlete Content"
        description="Own NFT Fan Passes, unlock VIP content, vote on athlete decisions, and access exclusive events. Join the next generation of fan engagement."
        keywords="fan tokens, NFT, athlete engagement, sports crypto, exclusive content"
        canonical="https://fansday.com/"
        ogTitle="FansDay – Where Fans Own the Game"
        ogDescription="Buy Fan Tokens to get lifetime or monthly access to exclusive videos, votes, contests & more."
        ogImage="https://fansday.com/assets/og-home.jpg"
        twitterCard="summary_large_image"
        twitterImage="https://fansday.com/assets/og-home.jpg"
      />
        {/* chat popup start */}
        {isChatPopupOpen &&
          <div className="fixed inset-0 z-[999] px-2 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden">
            <div className="rounded-xl shadow-lg text-center w-full h-full
                  flex items-center pb-[30px] justify-center relative"
            >
              <button onClick={chatPopupClose} className='close-btn absolute top-3 right-3 transition-all duration-300 hover:scale-110'>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 1L1 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M1 1L19 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>

              <EventChat event={selectedEvent} />

            </div>
          </div>
        }
        {/* chat popup end */}

        {/* video popup start */}
        {isVideoPopupOpen &&
          <VideoPopup url={selectedAthlete?.fto?.videoUrl} videoPopupClose={videoPopupClose} />
        }
        {/* video popup end */}

        <Navbar />

        <div className="flex h-[calc(100vh-145px)] min-[382px]:h-[calc(100vh-175px)] sm:h-[calc(100vh-196px)] 
            md:justify-between pt-4 sm:pt-6 md:pt-10 pb-8 md:pb-6
            gap-2 lg:gap-10 overflow-hidden relative w-full
            md:px-2 lg:px-10"
        >

          <Sidebar
            allAthletes={athletes}
            athletes={athletesWithAccess}
            onSelect={handleSelectAthlete}
            isBlurred={isExpanded}
            search={search}
            setSearch={setSearch}
            setSearchVisible={setSearchVisible}
          />

          <AthleteDetails
            key={selectedAthlete?.id}
            athlete={selectedAthlete}
            events={events}
            onEventClick={handleEventClick}
            isBlurred={isExpanded}
            ownsNFT={selectedAthlete?.ownsNFT}
            openVideoPopup={videoPopupOpen}
            search={search}
            setSearch={setSearch}
            searchVisible={searchVisible}
          />

          <RightSection
            isExpanded={isExpanded}
            selectedEvent={selectedEvent}
            onClose={handleClose}
            openChatPopup={chatPopupOpen}
          />
        </div>

        {/* footer start */}
        <div className="sticky w-full bottom-0 z-[100]">
          <StickyBar />
        </div>
        <Footer />

      </div>
  );
}

export default Home;
