import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AthleteDetails from "../components/AthleteDetails";
import RightSection from "../components/RightSection";
import StickyBar from "../components/StickyBar";
import Footer from "../components/Footer";
import MobileOnlyPage from "../components/mobileHome";
import MobileStickyBar from "../components/mobileStickyBar";

function Home() {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
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
    const fetchAthletes = async () => {
      const { data, error } = await supabase
        .from("Atheletes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching athletes:", error);
      else setAthletes(data);
    };

    setEvents([
      {
        title: "sad",
        video_url:
          "https://videos.pexels.com/video-files/8439147/8439147-uhd_2560_1440_25fps.mp4",
        description: "this is an event",
      },
    ]);

    fetchAthletes();
  }, []);

  const handleSelectAthlete = async (athlete) => {
    athlete.video_url =
      "https://nargvalmcrunehnemvpa.supabase.co/storage/v1/object/sign/Athlete/Villain%20LeBron%20did%20not%20forget.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdGhsZXRlL1ZpbGxhaW4gTGVCcm9uIGRpZCBub3QgZm9yZ2V0Lm1wNCIsImlhdCI6MTc0MTU5ODYyOCwiZXhwIjoxNzQ0MTkwNjI4fQ.LCNqKXp4xqfja0Ga7QdfeQ4Vk-ZEUjj5lq8tXSj5sqM";

    setSelectedAthlete(athlete);

    // const { data, error } = await supabase
    //   .from("Events")
    //   .select("*")
    //   .eq("athlete_id", athlete.id);

    // if (error) console.error("Error fetching events:", error);
    // else setEvents(data);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSelectedEvent(null);
  };

  return (
    <>
      {isMobile ? (
        <>
          {/* <Navbar />
        <div className='content'>
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
        </div> */}
          <Navbar />

          <MobileOnlyPage
            athletes={athletes}
            selectedAthlete={selectedAthlete}
            events={events}
            onSelectAthlete={handleSelectAthlete}
            onEventClick={handleEventClick}
          />

          <StickyBar />

          <Footer />
        </>
      ) : (
        <>
          <Navbar />
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
