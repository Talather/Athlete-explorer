import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaPlay } from 'react-icons/fa'

const MobileOnlyPage = ({
  athletes,
  selectedAthlete,
  events,
  onSelectAthlete,
  onEventClick
}) => {
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showVideo, setShowVideo] = useState(false)

  const styles = {
    appWrapper: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    },
    sidebar: {
      width: '70px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #ddd',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '10px',
      paddingLeft: '1px'
    },
    searchIcon: {
      marginBottom: '15px',
      cursor: 'pointer'
    },
    avatarWrapper: {
      marginBottom: '9px',
      textAlign: 'center'
    },
    avatar: {
      width: '55px',
      height: '55px',
      borderRadius: '50%',
      objectFit: 'cover',
      cursor: 'pointer'
    },
    nameLabel: {
      fontSize: '14px',
      marginBottom: '3px',
      wordBreak: 'break-word'
    },
    seeAll: {
      marginTop: 'auto',
      marginBottom: '10px',
      fontSize: '12px',
      color: '#999',
      writingMode: 'vertical-rl',
      transform: 'rotate(180deg)',
      cursor: 'pointer'
    },
    mainContentWrapper: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px'
    },
    searchBarContainer: {
      marginBottom: '16px'
    },
    searchInput: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      borderRadius: '12px',
      border: '1px solid #ccc',
      outline: 'none'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    videoWrapper: {
      position: 'relative',
      width: '100%',
      height: '240px',
      backgroundColor: '#ccc'
    },
    videoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    videoOverlay: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      color: '#fff',
      padding: '8px 12px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px'
    },
    cardContent: {
      padding: '12px 16px'
    },
    cardHeader: {
      fontSize: '12px',
      color: '#999',
      marginBottom: '6px'
    },
    cardText: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '6px'
    },
    cardMeta: {
      fontSize: '12px',
      color: '#777'
    }
  }

  const filteredAthletes = athletes.filter(athlete =>
    athlete.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='w-full mt-[27px] flex gap-[10px] h-[calc(100vh-165px)] 
      min-[382px]:h-[calc(100vh-193px)] min-[640px]:h-[calc(100vh-223px)]
      relative overflow-x-hidden pr-[10px]'
    >
      {/* Sidebar */}
      <div className='h-[calc(100%-20px)] shrink-0 w-[90px] min-[400px]:w-[115px] sticky z-30 left-0 top-0 rounded-r-[24px]
        bg-[#FAFAFB] border-l-0 border border-[#EBEBEB] overflow-x-hidden'
      >
        <div className='h-full w-full relative overflow-y-auto'>
          <div className='w-full primary-gradient h-2 sticky top-0'></div>

          <div className='divide-y-2 divide-[#EBEBEB]'>
            <button
              className='w-full p-[12px] flex items-center gap-1'
              onClick={() => setSearchVisible(!searchVisible)}
            >
              <FiSearch size={20} />
              <span className='text-black font-bold'>Search</span>
            </button>

            {filteredAthletes.map(athlete => (
              <div className='flex flex-col bg-white items-center gap-[6px] px-2 py-[10px]' key={athlete.id}>
                <img
                  src={athlete.profilePicture || 'https://via.placeholder.com/40'}
                  alt={athlete.firstName}
                  className='size-[55px] object-cover rounded-full shrink-0'
                  onClick={() => {
                    onSelectAthlete(athlete)
                    setShowVideo(false)
                  }}
                />
                <div className='text-sm font-bold'>{athlete.firstName?.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='relative w-[62%] min-[360px]:w-[68%] min-[400px]:w-[65%] min-[465px]:w-[70%] h-[calc(100%-20px)] rounded-[24px] overflow-hidden shrink-0'>
        {searchVisible && (
          <div className='absolute w-full px-3 top-3'>
            <input
              type='text'
              placeholder='Search athlete...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        )}

        {selectedAthlete ? (
          <>
            {/* Athlete Card with Image or Video */}
            <div style={styles.card} key={selectedAthlete.id}>
              <div style={styles.videoWrapper}>
                {!showVideo ? (
                  <>
                    <img
                      src={
                        selectedAthlete.image_url ||
                        'https://via.placeholder.com/300x240'
                      }
                      alt={selectedAthlete.firstName}
                      style={styles.videoImage}
                    />
                    <div
                      onClick={() => setShowVideo(true)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.6)',
                        borderRadius: '100%',
                        padding: '26px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaPlay style={{ color: '#fff', fontSize: '18px' }} />
                    </div>
                  </>
                ) : (
                  <video
                    key={selectedAthlete.id + '-video'}
                    controls
                    autoPlay
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '16px'
                    }}
                  >
                    <source src={selectedAthlete.video_url} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div style={styles.videoOverlay}>
                  <div>{selectedAthlete.firstName}</div>
                  {/* <div>{selectedAthlete.owners || '2.4m'} Owners</div> */}
                  {/* <div>{events.length} Events</div> */}
                </div>
              </div>
            </div>

            {/* Events List */}
            {/* {events.map(event => (
              <div
                key={event.id}
                style={styles.card}
                onClick={() => onEventClick(event)}
              >
                <div style={styles.cardContent}>
                  <div style={styles.cardHeader}>
                    📅 {event.date || 'Event'}
                  </div>
                  <div style={styles.cardText}>
                    {event.title || 'Untitled Event'}
                  </div>
                  <div style={styles.cardMeta}>
                    Description: {event.description || 'N/A'}
                  </div>
                </div>
              </div>
            ))} */}
          </>
        ) : (
          <div className='w-full h-full bg-[#FAFAFB] rounded-[24px] border border-[#EBEBEB]
            text-[#C9C8C8] flex flex-col items-center justify-center px-5 py-6'
          >
              <div className='text-center text-xl font-bold'>Select an Athlete</div>
              <div className='text-center'>To see more information, select athlete first.</div>
          </div>
        ) }
      </div>

      <div className='w-[244px] h-[calc(100%-20px)] rounded-[24px] 
        overflow-hidden shrink-0 px-5 py-6
        bg-[#FAFAFB] border border-[#EBEBEB]'
      >
        <div className='text-start text-xl font-bold'>Right Section</div>
        <div className='text-start text-[#969494]'>Additional content goes here.</div>
      </div>

    </div>
  )
}

export default MobileOnlyPage
