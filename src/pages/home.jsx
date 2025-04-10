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

    fetchAthletes();
  }, []);

  const handleSelectAthlete = async (athlete) => {
    // Clear events and set the athlete first
    setEvents([]);
    setSelectedAthlete(null);  // Optionally clear the selected athlete before setting the new one
  
    // Set the athlete and their video URL
    athlete.video_url ="https://nargvalmcrunehnemvpa.supabase.co/storage/v1/object/sign/Athlete/Villain%20LeBron%20did%20not%20forget.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdGhsZXRlL1ZpbGxhaW4gTGVCcm9uIGRpZCBub3QgZm9yZ2V0Lm1wNCIsImlhdCI6MTc0MTU5ODYyOCwiZXhwIjoxNzQ0MTkwNjI4fQ.LCNqKXp4xqfja0Ga7QdfeQ4Vk-ZEUjj5lq8tXSj5sqM";
    setSelectedAthlete(athlete);
  
    // Fetch events for the selected athlete
    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .eq("athelete_token_id", athlete.id);
  
    if (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } else {
      console.log("Fetched events:", data);
      setEvents(data || []);
    }
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
