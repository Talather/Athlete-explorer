import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import TimerOverlay from './timeOverlay';
import { client } from '../client';
import { useProfiles } from "thirdweb/react";
import EventChat from './EventChat';
function RightSection({ isExpanded, selectedEvent, onClose, openChatPopup }) {
  const { data: profiles } = useProfiles({
    client,
  });

  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
            <div className="mt-6 rounded-xl   border border-[#EEEEEE]  w-full aspect-video">
              <video
                controls
                width="100%"
                height="auto"
                className="w-full object-contain aspect-video"
              >
                <source src={selectedEvent.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button onClick={openChatPopup}
                className='p-4 primary-gradient w-full inline-block px-5 text-center py-3 mt-3 text-white font-bold text-xl'>
                OPEN CHAT
              </button>
            </div>
          )
        );

      case 'live_stream':
        return (
          selectedEvent?.live_stream_url && (
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
              <button onClick={openChatPopup}
                className='p-4 primary-gradient w-full inline-block px-5 text-center py-3 mt-3 text-white font-bold text-xl'>
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
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <div className="text-center mb-6">
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
    <div className={`shrink-0 border border-[#E7E7E7] bg-white rounded-3xl transition-all duration-300
      overflow-x-hidden overflow-y-auto py-5 px-6 relative
      ${isExpanded ? 'w-[45%] ml-[-28%]' : ' md:w-[200px] lg:w-[220px] xl:w-[300px]'}`}
    >
      {isExpanded ? (
        <>
          <div className="w-full text-end">
            <button className='close-btn' onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 1L1 19" stroke="#0A0B0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1 1L19 19" stroke="#0A0B0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div>
            <h2 className="text-2xl text-black font-bold">{selectedEvent?.name}</h2>
            <p className="text-lg text-[#969494] mb-2">{selectedEvent?.description}</p>
          </div>

          {renderEventContent()}

        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-full space-y-1">
          <h2 className="text-center text-[#C9C8C8] text-[28px] font-bold leading-tight">
            Select an Athlete and an Event.
          </h2>
          <p className="text-center text-[#C9C8C8] text-lg leading-tight">
            To see more information, select an athlete and an event first.
          </p>
        </div>
      )}
    </div>
  )
}

export default RightSection
