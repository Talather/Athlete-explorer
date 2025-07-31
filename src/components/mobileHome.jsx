import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaPlay } from 'react-icons/fa'
import { motion } from "framer-motion";
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import TimerOverlay from './timeOverlay';
import { client } from '../client';
import { useProfiles } from "thirdweb/react";
import { useSelector } from "react-redux";
import EventChat from './EventChat';
import ReactCountryFlag from "react-country-flag"
import { getCountryFlagFromName } from "../utils/countries";
import VideoPopup from './VideoPopup';
import MobileSidebar from './mobileSidebar';

const MobileOnlyPage = ({
  athletes,
  allAthletes,
  selectedAthlete,
  events,
  onSelectAthlete,
  isExpanded,
  onClose,
  onEventClick,
  ownsNFT,
  openChatPopup,
  openVideoPopup
}) => {

  const { data: profiles } = useProfiles({ client });
  const [searchVisible, setSearchVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [videoUrl, setVideoUrl] = useState(selectedAthlete?.fto?.videoUrl || "https://nargvalmcrunehnemvpa.supabase.co/storage/v1/object/sign/Athlete/Villain%20LeBron%20did%20not%20forget.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdGhsZXRlL1ZpbGxhaW4gTGVCcm9uIGRpZCBub3QgZm9yZ2V0Lm1wNCIsImlhdCI6MTc0MTU5ODYyOCwiZXhwIjoxNzQ0MTkwNjI4fQ.LCNqKXp4xqfja0Ga7QdfeQ4Vk-ZEUjj5lq8tXSj5sqM");
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const { currency } = useSelector(state => state.settings);

  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(athletes);
  const [filteredAllAthletes, setFilteredAllAthletes] = useState(allAthletes);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);

  const sidebarContainerRef = useRef(null);
  const sidebarScrollPosition = useRef(0);
  const isInitialMount = useRef(true);

  const handleAthleteClick = useCallback((athlete) => {
    // Save scroll position before updating state
    if (sidebarContainerRef.current) {
      sidebarScrollPosition.current = sidebarContainerRef.current.scrollTop;
    }

    onSelectAthlete(athlete);
    setVideoUrl(athlete?.fto?.videoUrl);
    setShowVideo(false);
  }, [onSelectAthlete]);

  // Restore scroll position after render
  useEffect(() => {
    if (sidebarContainerRef.current) {
      sidebarContainerRef.current.scrollTop = sidebarScrollPosition.current;
    }
  }, [athletes, allAthletes, search]);


  const videoPopupOpen = () => {
    setIsVideoPopupOpen(true);
    document.body.style.overflow = 'hidden';
  }

  const videoPopupClose = () => {
    setIsVideoPopupOpen(false);
    document.body.style.overflow = 'auto';
  }

  const handleSubscriptionPurchase = async () => {
    if (!selectedAthlete?.id || !profiles?.[0]?.details?.id || !profiles?.[0]?.details?.email) {
      toast.error('Please connect your wallet and ensure all required information is available');
      return;
    }

    setSubscriptionLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout-session', {
        body: {
          athleteId: selectedAthlete.id,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an allowed image or video type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Only PNG, JPG, JPEG images and MP4, MOV, AVI videos are allowed');
        return;
      }

      setUploadFile(file);
      setUploadError(null);
    }
  };

  const handleSubmit = async () => {
    if (!uploadFile || !selectedEvent) return;
    if (!profiles || profiles.length === 0) {
      setUploadError('Please connect your wallet first to upload files');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      const userId = profiles[0]?.details.id;

      // Check if user has already submitted to this event
      const { data: existingSubmission, error: checkError } = await supabase
        .from('Submissions')
        .select('*')
        .eq('eventId', selectedEvent.id)
        .eq('userId', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error checking existing submission:', checkError);
        throw checkError;
      }

      if (existingSubmission) {
        setUploadError('You have already submitted an entry for this contest');
        setUploading(false);
        return;
      }

      // Create a unique file name with timestamp
      const timestamp = new Date().getTime();
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `contest_submissions/${selectedEvent.id}/${fileName}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('athletes')
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('athletes')
        .getPublicUrl(filePath);

      // Store the submission details in the database
      const { error: insertError } = await supabase
        .from('Submissions')
        .insert({
          eventId: selectedEvent.id,
          fileLink: publicUrl,
          fileName: uploadFile.name,
          created_at: new Date(),
          userId: userId
        });

      if (insertError) throw insertError;

      setUploadSuccess(true);
      setUploadFile(null);
      // Reset the file input
      document.getElementById('mobile-contest-file-input').value = '';

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload the file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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
    },
    cardMeta: {
      fontSize: '12px',
      color: '#777',
      padding: '2px 0'
    }
  }

  useEffect(() => {
    const searchLower = search.toLowerCase();

    const filteredSubset = athletes.filter(athlete =>
      (athlete.fanTokenSymbol?.toLowerCase() || '').includes(searchLower)
    );
    setFiltered(filteredSubset);

    const filteredAll = allAthletes.filter(athlete =>
      (athlete.fanTokenSymbol?.toLowerCase() || '').includes(searchLower)
    );
    setFilteredAllAthletes(filteredAll);
  }, [search, athletes, allAthletes]);

  const withAccess = filtered.filter(a => a.hasAccess);
  const withoutAccess = filtered.filter(a => !a.hasAccess);

  // console.log("mobile athletes", athletes);

  // Event content rendering function for the right sidebar when expanded
  const renderEventDetailContent = () => {
    if (!selectedEvent) return null;

    switch (selectedEvent.type) {
      case 'video':
        return (
          selectedEvent?.video_url && (
            <div className="mt-6 w-full">
              <button onClick={videoPopupOpen}
                className='relative w-full aspect-video bg-gray-700 group rounded-xl overflow-hidden'>

                {/* cover photo */}
                <span className='w-full h-full'>
                  <video
                    autoPlay
                    controls
                    muted
                    className="w-full h-full object-contain"
                  >
                    <source src={selectedEvent?.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </span>

                <span className='absolute top-0 left-0 w-full h-full'>
                  <span className='size-[55px] 
                      flex items-center justify-center
                      rounded-full z-[3] bg-black/60 
                      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      text-[20px] text-white pl-0.5 pb-0.5
                      transition-all duration-500 opacity-100 group-hover:scale-105'
                  >
                    ▶
                  </span>
                </span>

              </button>

              <button onClick={openChatPopup}
                className='p-4 primary-gradient w-full inline-block px-5 text-center py-3 mt-3 text-white font-bold text-xl rounded-lg'>
                OPEN CHAT
              </button>
            </div>
          )
        );

      case 'live_stream':
        return (
          <div>
            {selectedEvent?.live_stream_url && (
              <div className="mt-6 rounded-xl overflow-hidden relative">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedEvent.live_stream_url}
                    title="Livestream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="bg-red-500 text-white px-3 py-1 rounded-full absolute top-2 right-2 z-30 text-sm font-medium">
                  LIVE
                </div>
              </div>
            )}
            <button onClick={openChatPopup}
              className='p-4 primary-gradient w-full inline-block px-5 text-center py-3 mt-3 text-white font-bold text-xl'>
              OPEN CHAT
            </button>
          </div>
        );

      case 'contest':
        const currentDate = new Date();
        const contestEndDate = selectedEvent.contest_end_date ? new Date(selectedEvent.contest_end_date) : null;
        const isContestEnded = contestEndDate ? currentDate > contestEndDate : false;

        return (
          <div>
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg mb-2">
                  {isContestEnded ? "Contest has ended" : "Upload Your Submission"}
                </h3>

                {!isContestEnded ? (
                  <>
                    <p className="text-gray-600 mb-2">Participate in this contest by uploading your content below</p>

                    {contestEndDate && (
                      <div className="mb-4 flex justify-center">
                        <TimerOverlay
                          endDate={contestEndDate}
                          startDate={null}
                          isBeforeStartDate={false}
                          onTimerEnd={() => window.location.reload()}
                          isContest={true}
                        />
                      </div>
                    )}

                    {uploadSuccess && (
                      <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                        Your submission was uploaded successfully!
                      </div>
                    )}

                    {uploadError && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {uploadError}
                      </div>
                    )}

                    <div className="bg-white rounded-lg p-4 border border-indigo-100 mb-4">
                      <label className="flex flex-col items-center justify-center cursor-pointer p-6 border-2 border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors relative">
                        <input
                          id="mobile-contest-file-input"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".jpg,.jpeg,.png,.mp4,.mov,.avi"
                          onChange={handleFileChange}
                          disabled={uploading}
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-10 h-10 text-indigo-400 mb-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        <p className="text-indigo-600 font-medium">Click to upload</p>
                        <p className="text-gray-500 text-sm">
                          or drag and drop
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          PNG, JPG, JPEG images and MP4, MOV, AVI videos only
                        </p>

                        {uploadFile && (
                          <div className="mt-2 text-sm bg-indigo-50 p-2 rounded-lg w-full">
                            <p className="text-indigo-700 font-medium truncate">{uploadFile.name}</p>
                            <p className="text-gray-500">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                          </div>
                        )}
                      </label>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!uploadFile || uploading}
                      className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition-all ${(!uploadFile || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploading ? 'Uploading...' : 'Submit Entry'}
                    </button>
                  </>
                ) : (
                  <p className="text-red-500 font-medium">
                    This contest is over, we will announce the winners by email soon.
                  </p>
                )}
              </div>
            </div>
            <button onClick={openChatPopup}
              className='p-4 primary-gradient w-full inline-block px-5 text-center py-3 mt-3 text-white font-bold text-xl'>
              OPEN CHAT
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (

    <>
      {/* video popup start */}
      {isVideoPopupOpen &&
        <VideoPopup url={selectedEvent?.video_url} videoPopupClose={videoPopupClose} />
      }
      {/* video popup end */}

      <div className='w-full mt-[27px] flex gap-[10px] h-[calc(100vh-165px)] 
        min-[382px]:h-[calc(100vh-193px)] min-[640px]:h-[calc(100vh-223px)]
        relative overflow-x-hidden pr-[10px]'
      >
        {/* Sidebar */}
        <div className='h-[calc(100%-20px)] shrink-0 w-[90px] min-[400px]:w-[115px] sticky z-30 left-0 top-0 rounded-r-[24px]
          bg-[#FAFAFB] border-l-0 border border-[#EBEBEB] overflow-x-hidden'
        >
          <div ref={sidebarContainerRef} className='h-full w-full relative overflow-y-auto'>
            <div className='w-full primary-gradient h-2 sticky top-0'></div>

            <div className=''>
              <button
                className='w-full p-[12px] flex items-center gap-1 border-b border-[#EBEBEB]'
                onClick={() => setSearchVisible(!searchVisible)}
              >
                <FiSearch size={20} />
                <span className='text-black font-bold'>Search</span>
              </button>

              {(withAccess.length > 0 || withoutAccess.length > 0) ? (
                <div className='w-full'>

                  {withAccess.length > 0 &&
                    <MobileSidebar
                      athletes={withAccess}
                      title="🎯 My Athletes"
                      onClick={handleAthleteClick}
                    />
                  }

                  {withoutAccess.length > 0 && (
                    <MobileSidebar
                      athletes={withoutAccess}
                      title="🔒 Locked Athletes"
                      onClick={handleAthleteClick}
                    />
                  )}
                </div>
              ) : (
                <div className='w-full'>
                  {filteredAllAthletes.length > 0 && (
                    <MobileSidebar
                      athletes={filteredAllAthletes}
                      title="🔒 Locked Athletes"
                      onClick={handleAthleteClick}
                    />
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className='relative w-[calc(100%-120px)] 
              min-[400px]:w-[calc(100%-146px)] h-[calc(100%-20px)] 
              rounded-[24px] overflow-y-auto'
        >
          {searchVisible && (
            <div className='absolute w-full px-3 top-3 z-50'>
              <input
                type='text'
                placeholder='Search athlete...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          )}

          {selectedAthlete ? (
            <>
              <div
                style={styles.card} key={selectedAthlete.id}
                className='relative z-20'
              >
                <div style={styles.videoWrapper}>
                  {!showVideo ? (
                    <>
                      <img
                        src={
                          selectedAthlete.profilePicture ||
                          'https://via.placeholder.com/300x240'
                        }
                        alt={selectedAthlete.firstName}
                        style={styles.videoImage}
                      />
                      {(selectedAthlete?.id && videoUrl) && (
                        <div
                          onClick={openVideoPopup}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.6)',
                            borderRadius: '100%',
                            padding: '18px',
                            cursor: 'pointer'
                          }}
                        >
                          <FaPlay style={{ color: '#fff', fontSize: '14px' }} />
                        </div>
                      )}
                    </>
                  ) : (
                    <video
                      key={selectedAthlete.id + '-video'}
                      autoPlay
                      muted
                      className='w-full h-full object-cover rounded-[16px]'
                      onEnded={() => {
                        setShowVideo(false);
                      }}
                    >
                      <source src={videoUrl} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  <div className='bg-black/80 w-full 
                    absolute top-0 px-4 py-2
                    flex items-start justify-between'
                  >
                    {selectedAthlete.fanTokenSymbol &&
                      <div className="text-[4cqw] font-bold text-white">
                        $ {selectedAthlete.fanTokenSymbol}
                      </div>
                    }

                    {selectedAthlete?.country &&
                      <div className="max-w-[25px] w-full ml-auto overflow-hidden">
                        <ReactCountryFlag style={{ width: '100%', height: '100%', borderRadius: '2px' }} countryCode={getCountryFlagFromName(selectedAthlete.country)} svg />
                      </div>
                    }

                  </div>

                  <div className='bg-black/80 w-full 
                      absolute bottom-0 px-4 py-2'
                  >
                    <div className='flex gap-1 items-center justify-between'>
                      {selectedAthlete?.dayOfTheWeek &&
                        <div className="text-white text-[4cqw] leading-tight font-bold">
                          {selectedAthlete?.dayOfTheWeek || "Athlete dayOfTheWeek"}
                        </div>
                      }
                      {selectedAthlete?.sport &&
                        <div className="text-white text-[4cqw] leading-tight font-bold">
                          {selectedAthlete?.sport}
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className='w-full'>
                {events.length > 0 ? (
                  events.map(event => (
                    <div
                      key={event.id} // Always add a key when mapping!
                      style={styles.card}
                      onClick={() => {
                        onEventClick(event);
                        setSelectedEvent(event);
                      }}
                    >
                      <div style={styles.cardContent}>
                        <div className='w-full flex items-center justify-between gap-1'>
                          <div style={styles.cardText}>
                            {event.name || 'Untitled Event'}
                          </div>

                          <div className="shrink-0 primary-gradient overflow-hidden p-0.5 rounded-[12px]
                            cursor-pointer text-white min-w-[80px] py-1 px-2.5 text-center"
                          >
                            {event.type}
                          </div>
                        </div>
                        <div style={styles.cardMeta}>
                          {event.description || 'N/A'}
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className={`border border-[#E7E7E7] shadow-sm bg-[#FCFCFC]
                      rounded-2xl flex items-center justify-center text-[#C9C8C8] text-lg font-bold p-6 overflow-y-auto`}
                  >
                    <h2
                      style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}
                    >
                      {ownsNFT === true ? (
                        <div className="text-center flex flex-col items-center">
                          <span>⏳</span>
                          <span>
                            The first event of ${selectedAthlete.fanTokenSymbol} will be posted soon!
                          </span>
                        </div>
                      ) : (
                        <div className='flex flex-col items-center justify-center gap-1'>
                          <div className="text-center flex flex-col items-center">
                            <span className="text-3xl">
                              🔒
                            </span>
                            <span>
                              You need at least one ${selectedAthlete.fanTokenSymbol} token or a subscription to see these events.
                            </span>
                          </div>

                          {!ownsNFT && (
                            <button
                              className="text-white shrink-0 p-3 text-[3cqw] rounded-full primary-gradient leading-tight 
                            w-full h-full flex items-center justify-center max-w-[35cqw] cursor-pointer
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

            </>
          ) : (
            <div className='w-full h-full bg-[#FAFAFB] rounded-[24px] border border-[#EBEBEB]
                text-[#C9C8C8] flex flex-col items-center justify-center px-5 py-6'
            >
              <div className='text-center text-xl font-bold'>Select an Athlete</div>
            </div>
          )}
        </div>

        <div className={`h-[calc(100%-20px)] rounded-[24px] 
          overflow-x-hidden overflow-y-auto shrink-0 bg-[#FAFAFB] 
          border border-[#EBEBEB] absolute z-50 right-0 transition-all duration-300
          ${isExpanded ? 'translate-x-0 w-full' : 'translate-x-[89%] w-[244px]'}`}
        >
          <div className='px-6 py-7 relative z-50'>

            {/* cross button */}
            <button className='close-btn absolute top-2.5 right-2.5' onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 1L1 19" stroke="#0A0B0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1 1L19 19" stroke="#0A0B0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            {!isExpanded &&
              <button className='absolute top-2.5 left-2'>
                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7C3 6.44772 3.44772 6 4 6C4.55228 6 5 6.44772 5 7Z" fill="black" />
                  <path d="M9 7C9 7.55228 8.55229 8 8 8C7.44772 8 7 7.55228 7 7C7 6.44772 7.44772 6 8 6C8.55229 6 9 6.44772 9 7Z" fill="black" />
                  <path d="M12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z" fill="black" />
                  <path d="M2.16466 14.8029L2.18489 14.7989C4.01434 14.4363 5.13337 13.9571 5.65284 13.6939C6.39508 13.8929 7.18324 14 8 14C12.4183 14 16 10.866 16 7C16 3.13401 12.4183 0 8 0C3.58172 0 0 3.13401 0 7C0 8.76087 0.743061 10.3699 1.96979 11.6001C1.89596 12.3711 1.69422 13.1984 1.44648 13.9181L1.44259 13.9294C1.41245 14.0167 1.38164 14.1023 1.3503 14.1861C1.30097 14.3179 1.25034 14.4451 1.19898 14.5664C1.12037 14.7521 1.27271 14.9603 1.47172 14.9277C1.61264 14.9047 1.75 14.8808 1.88382 14.8563C1.97922 14.8388 2.07283 14.821 2.16466 14.8029ZM2.96523 11.6954C2.99363 11.3988 2.88828 11.1049 2.67789 10.894C1.6173 9.83038 1 8.46809 1 7C1 3.80754 4.0044 1 8 1C11.9956 1 15 3.80754 15 7C15 10.1925 11.9956 13 8 13C7.27076 13 6.56966 12.9044 5.91182 12.728C5.67381 12.6642 5.42062 12.6905 5.20082 12.8019C4.81358 12.9981 3.96166 13.3721 2.56677 13.6945C2.75502 13.0519 2.90159 12.3601 2.96523 11.6954Z" fill="black" />
                </svg>
              </button>
            }

            {isExpanded && selectedEvent ? (
              <div className='w-full'>
                <h2 className="text-2xl text-black font-bold">{selectedEvent?.name}</h2>
                <p className="text-lg text-[#969494] mb-2">{selectedEvent?.description}</p>

                {renderEventDetailContent()}
              </div>
            ) : (
              <div className='w-full'>
                <div className='text-start text-xl font-bold'>Right Section</div>
                <div className='text-start text-[#969494]'>Additional content goes here.</div>
              </div>
            )}
          </div>
        </div>

      </div>

    </>
  )
}

export default MobileOnlyPage
