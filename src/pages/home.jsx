import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AthleteDetails from '../components/AthleteDetails'
import RightSection from '../components/RightSection'
import StickyBar from '../components/StickyBar'
import Footer from '../components/Footer'

function Home () {
  const [athletes, setAthletes] = useState([])
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchAthletes = async () => {
        const { data, error } = await supabase.from('Athlete').select('*')
        console.log("data of aheltes",data,error)
      if (error) console.error('Error fetching athletes:', error)
      else setAthletes(data)
    }

    fetchAthletes()
  }, [])

  const handleSelectAthlete = async athlete => {
    setSelectedAthlete(athlete)

    const { data, error } = await supabase
      .from('Events')
      .select('*')
      .eq('athlete_id', athlete.id)

    if (error) console.error('Error fetching events:', error)
    else setEvents(data)
  }

  const handleEventClick = event => {
    setSelectedEvent(event)
    setIsExpanded(true)
  }

  const handleClose = () => {
    setIsExpanded(false)
    setSelectedEvent(null)
  }

  return (
    <>
      <Navbar />
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
      </div>
      <StickyBar />
      <Footer />
    </>
  )
}

export default Home
