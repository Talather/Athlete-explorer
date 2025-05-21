import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAthletes, fetchAthleteEvents, setSelectedEvent, clearSelectedEvent ,setEvents , setSelectedAthlete } from "../store/slices/athleteSlice";
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
import { useProfiles , useActiveWallet } from "thirdweb/react";
import { userOwnsNFT } from "./../utils/userOwnsNft";
import toast, { Toaster } from 'react-hot-toast';

function Home() {

  const wallet = useActiveWallet();
  const address = wallet?.getAccount().address;

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
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    // Dispatch the fetchAthletes action when component mounts
    dispatch(fetchAthletes());
  }, [dispatch]);

  const handleSelectAthlete = async (athlete) => {
    if (!address) {
      toast.error("Please connect your wallet to continue", {
        icon: '🔒',
        duration: 3000
      });
      return;
    }
    if(!athlete.nftContractAddress){
      console.log("NO CONTRACT")
      dispatch(setSelectedAthlete({...athlete,

        video_url: "https://nargvalmcrunehnemvpa.supabase.co/storage/v1/object/sign/Athlete/Villain%20LeBron%20did%20not%20forget.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdGhsZXRlL1ZpbGxhaW4gTGVCcm9uIGRpZCBub3QgZm9yZ2V0Lm1wNCIsImlhdCI6MTc0MTU5ODYyOCwiZXhwIjoxNzQ0MTkwNjI4fQ.LCNqKXp4xqfja0Ga7QdfeQ4Vk-ZEUjj5lq8tXSj5sqM"

      }));
      dispatch(setEvents([]));
      return;
    }
    const ownsNFT = await userOwnsNFT(
      athlete.nftContractAddress,
      address
    );
    console.log(ownsNFT);

    if (ownsNFT) {
      dispatch(fetchAthleteEvents(athlete));
      return;
    }
    else{
      dispatch(setSelectedAthlete({...athlete,

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

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
        },
        error: {
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#fff',
          },
        },
      }} />
      {isMobile ? (
        <>
        <div className="w-full relative h-[100dvh]">
          <Navbar />

          <MobileOnlyPage
            athletes={athletes}
            selectedAthlete={selectedAthlete}
            events={events}
            onSelectAthlete={handleSelectAthlete}
            onEventClick={handleEventClick}
            isExpanded={isExpanded}
            onClose={handleClose}
          />

          <div className="sticky w-full bottom-0 z-50">
            <StickyBar />
          </div>

          <Footer />
        </div>
        </>
      ) : (
        <>
          <Navbar/>
          <div className="flex h-[calc(100vh-196px)] gap-5 lg:gap-10 justify-between pt-10 pb-6 px-10">
            <Sidebar
              athletes={athletes}
              onSelect={handleSelectAthlete}
              isBlurred={isExpanded}
            />
            <AthleteDetails
              key={selectedAthlete?.id}
              athlete={selectedAthlete}
              events={events}
              onEventClick={handleEventClick}
              isBlurred={isExpanded}
            />
            <RightSection
              isExpanded={isExpanded}
              selectedEvent={selectedEvent}
              onClose={handleClose}
            />
          </div>
          <StickyBar />
          <Footer />
        </>
      )}
    </>
  );
}

export default Home;
