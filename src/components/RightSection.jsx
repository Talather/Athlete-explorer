import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import TimerOverlay from './timeOverlay';
import { client } from '../client';
import { useProfiles } from "thirdweb/react";
import EventChat from './EventChat';
import VideoPopup from './VideoPopup';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
function RightSection({ isExpanded, selectedEvent, onClose, openChatPopup }) {
  const { data: profiles } = useProfiles({
    client,
  });

  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);

  const videoPopupOpen = () => {
    setIsVideoPopupOpen(true);
    document.body.style.overflow = 'hidden';
  }

  const videoPopupClose = () => {
    setIsVideoPopupOpen(false);
    document.body.style.overflow = 'auto';
  }

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
      let publicUrl = "";


      const { data, error } = await supabase.storage
        .from('athletes')
        .upload(fileName, uploadFile);
      console.log(error);


      if (error) throw error;
      publicUrl = "https://veoivkpeywpcyxaikgng.supabase.co/storage/v1/object/public/" + data.fullPath;

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
      document.getElementById('contest-file-input').value = '';

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload the file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const renderEventContent = () => {
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
                className='p-4 primary-gradient w-full inline-block px-5 text-center py-3 mt-3 text-white font-bold text-xl rounded-xl'>
                OPEN CHAT
              </button>
            </div>
          )
        );

      case 'live_stream':
        console.log(selectedEvent?.live_stream_url);
        return (
          selectedEvent?.live_stream_url && (
            <div>
              <div className="mt-6 rounded-xl overflow-hidden relative">
              <LiteYouTubeEmbed
                  id={selectedEvent?.live_stream_url}
                  title="What’s new in Material Design for the web (Chrome Dev Summit 2019)"
              />
                {/* <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={"selectedEvent.live_stream_url"}
                    title="Livestream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div> */}
                <div className="bg-red-500 text-white px-3 py-1 rounded-full absolute top-2 right-2 z-30 text-sm font-medium">
                  LIVE
                </div>
              </div>
                <button onClick={openChatPopup}
                  className='p-4 primary-gradient w-full inline-block px-5 text-center py-3 mt-3 text-white font-bold text-xl rounded-xl'>
                  OPEN CHAT
                </button>
            </div>
          )
        );

      case 'contest':
        const currentDate = new Date();
        const contestEndDate = selectedEvent.contest_end_date ? new Date(selectedEvent.contest_end_date) : null;
        const isContestEnded = contestEndDate ? currentDate > contestEndDate : false;

        return (
          <div className='w-full'>
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Upload Your Submission</h3>
                <p className="text-gray-600 mb-4">Participate in this contest by uploading your content below</p>
                <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-2">
                  {!isContestEnded ? (
                    <div className="text-center">
                      <div className="text-indigo-600 font-bold">Contest in progress</div>
                      <div className="text-sm text-gray-600">
                        {contestEndDate ? `Ends on: ${contestEndDate.toLocaleDateString()}` : 'No end date specified'}
                      </div>
                      {contestEndDate && (
                        <div className="mt-2 flex justify-center">
                          <TimerOverlay
                            endDate={contestEndDate}
                            startDate={null}
                            isBeforeStartDate={false}
                            onTimerEnd={() => window.location.reload()}
                            isContest={true}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-red-500 font-bold">
                      Contest has ended
                    </div>
                  )}
                </div>

                {!isContestEnded ? (
                  <>
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
                          id="contest-file-input"
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
                        <p className="text-gray-500 text-sm">or drag and drop</p>
                        <p className="text-gray-500 text-xs mt-1">Only PNG, JPG, JPEG images and MP4, MOV, AVI videos are allowed</p>

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
                      className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition-all ${(!uploadFile || uploading) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      {uploading ? 'Uploading...' : 'Submit Entry'}
                    </button>

                  </>
                ) : (
                  <p className="text-gray-600 mb-4">
                    This contest is over, we will announce the winners by email soon.
                  </p>
                )}
              </div>
            </div>
            <button onClick={openChatPopup}
              className='p-4 primary-gradient w-full inline-block px-5 text-center py-3 mt-3 text-white font-bold text-xl rounded-xl'>
              OPEN CHAT
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // console.log("Selected Event", selectedEvent);

  return (
    <>
      {/* video popup start */}
      {isVideoPopupOpen &&
        <VideoPopup url={selectedEvent?.video_url} videoPopupClose={videoPopupClose} />
      }
      {/* video popup end */}

      <div className={`shrink-0 border border-[#E7E7E7] bg-white rounded-3xl transition-all duration-300
          overflow-x-hidden overflow-y-auto z-50 
          lg:h-full 
          h-[calc(100vh-190px)] min-[382px]:h-[calc(100vh-222px)] sm:h-[calc(100vh-243px)] md:h-[calc(100vh-258px)]
          absolute lg:relative
          right-0 lg:right-auto
        ${isExpanded ? 'translate-x-0 w-full sm:w-1/2 lg:w-[45%] lg:ml-[-28%]' : 'translate-x-[90%] lg:translate-x-0 w-[244px] lg:w-[200px] xl:w-[300px]'}`}
      >

        {!isExpanded &&
          <button className='absolute top-2.5 left-1.5 lg:hidden'>
            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7C3 6.44772 3.44772 6 4 6C4.55228 6 5 6.44772 5 7Z" fill="black" />
              <path d="M9 7C9 7.55228 8.55229 8 8 8C7.44772 8 7 7.55228 7 7C7 6.44772 7.44772 6 8 6C8.55229 6 9 6.44772 9 7Z" fill="black" />
              <path d="M12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z" fill="black" />
              <path d="M2.16466 14.8029L2.18489 14.7989C4.01434 14.4363 5.13337 13.9571 5.65284 13.6939C6.39508 13.8929 7.18324 14 8 14C12.4183 14 16 10.866 16 7C16 3.13401 12.4183 0 8 0C3.58172 0 0 3.13401 0 7C0 8.76087 0.743061 10.3699 1.96979 11.6001C1.89596 12.3711 1.69422 13.1984 1.44648 13.9181L1.44259 13.9294C1.41245 14.0167 1.38164 14.1023 1.3503 14.1861C1.30097 14.3179 1.25034 14.4451 1.19898 14.5664C1.12037 14.7521 1.27271 14.9603 1.47172 14.9277C1.61264 14.9047 1.75 14.8808 1.88382 14.8563C1.97922 14.8388 2.07283 14.821 2.16466 14.8029ZM2.96523 11.6954C2.99363 11.3988 2.88828 11.1049 2.67789 10.894C1.6173 9.83038 1 8.46809 1 7C1 3.80754 4.0044 1 8 1C11.9956 1 15 3.80754 15 7C15 10.1925 11.9956 13 8 13C7.27076 13 6.56966 12.9044 5.91182 12.728C5.67381 12.6642 5.42062 12.6905 5.20082 12.8019C4.81358 12.9981 3.96166 13.3721 2.56677 13.6945C2.75502 13.0519 2.90159 12.3601 2.96523 11.6954Z" fill="black" />
            </svg>
          </button>
        }

        {isExpanded ? (
          <div className='relative'>
            <div className="bg-white w-full text-end sticky top-0 left-0 px-4 pt-2.5">
              <button className='close-btn' onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 1L1 19" stroke="#0A0B0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M1 1L19 19" stroke="#0A0B0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>

            <div className='px-6'>
              <h2 className="text-2xl text-black font-bold">{selectedEvent?.name}</h2>
              <p className="text-lg text-[#969494] mb-2">{selectedEvent?.description}</p>
            </div>

            <div className='pb-5 px-6'>
              {renderEventContent()}
            </div>

          </div>
        ) : (
          <div className="py-5 px-6 w-full flex flex-col items-center justify-center h-full space-y-1">
            <h2 className="text-center text-[#C9C8C8] text-[28px] font-bold leading-tight">
              Select an Athlete and an Event.
            </h2>
          </div>
        )}
      </div>
    </>
  )
}

export default RightSection
