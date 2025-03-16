import React, { useState } from 'react'
import FAQItem from '../components/FAQItem'
import RightSidebar from '../components/durhino_siderbar/code' // Sidebar component
import '../styles/durhino.css'
import '../components/durhino_siderbar/style.css'

import VideoWithCover from './videoWithCover'

function DurinhoPage () {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <>
      <div className='header-logo'>
        <img src='/sixer.gif' width={80} height={70} alt='Logo' />
      </div>
      <div className='header'>
        <h1>DURINHO day (Round 1)</h1>
      </div>

      <div className='durinho-wrapper'>
        <div className='durinho-container'>
          {/* Left: Video + Progress */}
          <div className='durinho-left'>
            <div className='video-wrapper'>
              {/* <iframe
                src='https://www.youtube.com/embed/wsCmWZSASes'
                frameBorder='0'
                allowFullScreen
                title='Durinho Video'
              ></iframe> */}
              <VideoWithCover
                coverImage={'/durinho-fto-picture-p-800.png'}
                videoSrc={
                  'https://nargvalmcrunehnemvpa.supabase.co/storage/v1/object/sign/Athlete/AQP7fVnWSGc0z-v1SIiWeU-dA5xtUXnJlJwiuwtnFzCYUlV3VV26KSVTsTjVg4SAFZsxqikhCP3NAy1xFepscdEv.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdGhsZXRlL0FRUDdmVm5XU0djMHotdjFTSWlXZVUtZEE1eHRVWG5KbEp3aXV3dG5GekNZVWxWM1ZWMjZLU1ZUc1RqVmc0U0FGWnN4cWlraENQM05BeTF4RmVwc2NkRXYubXA0IiwiaWF0IjoxNzQyMDQzNjkxLCJleHAiOjE3NDI2NDg0OTF9.R-jDdDSgWUGcxK9zlp0w3_hRSUCszJZWuQerIqDNUok'
                }
              />

              {/* <div className='timer-overlay'>
                The sale will end in <strong>21:28:32</strong>
              </div> */}

              
            </div>

            <div className='tokens-left'>
              Tokens left: <strong>14%</strong>
              <div className='token-bar'>
                <div className='filled' style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>

          {/* Right: Info Card */}
          <div className='durinho-right'>
            <div className='profile'>
              <div className='pMain'>
                <div
                  style={{
                    width: '81px',
                    height: '81px',
                    borderRadius: '50%',
                    marginRight: '7px'
                  }}
                >
                  <img src='/lsg.png' alt='Durinho' />
                </div>
                <div>
                  <h2 style={{ fontSize: '25px',fontWeight:"500" }}>
                    $DURINHO{' '}
                    <span role='img'>
                      <img
                        style={{
                          width: '35px',
                          height: '25px',
                          borderRadius: '0px'
                        }}
                        src='/brazilian-flag.png'
                        alt='flag'
                      />
                    </span>
                  </h2>
                  <p className='label'>Athlete</p>
                </div>
              </div>

              <div className='publish'>
                <strong>FRIDAY</strong>
                <span>Publication time</span>
              </div>
            </div>

            <div className='name-block'>
              <h3  style={{
                          fontWeight:'550',fontSize:'33px'
                        }} >Gilbert &quot;Durinho&quot; Burns</h3>
              <p>Brazilian mixed martial artist, UFC Welterweight fighter</p>
            </div>

            <div className='token-info'>
              <div
                className='token-infoo'
                style={{
                  backgroundColor: '#fafafa',
                  textAlign: 'center',
                  borderRadius: '4px'
                  // padding: '15px 65px'
                }}
              >
                <strong style={{ fontSize: '26px',fontWeight:"550" }}>100 000 $DURINHO</strong>
                <p style={{ fontSize: '21px' }}>Tokens for sale</p>
              </div>

              <div
                style={{
                  backgroundColor: '#fafafa',
                  textAlign: 'center',
                  borderRadius: '4px'
                  // padding: '15px 65px'
                }}
                className='token-infoo'
              >
                <strong style={{ fontSize: '26px',fontWeight:"550" }}>07/15/2023</strong>
                <p style={{ fontSize: '21px' }}>Token sale start date</p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}
            >
              <h3 className='price' style={{ marginLeft: '6vw',fontSize:"50px" }}>
                $5.00
              </h3>

              <div
                className='fto-button-border-gradient'
                style={{ marginLeft: '0px',fontSize:"50px" }}
              >
                <div
                  className='fto-button-wrappr'
                  onClick={() => setShowSidebar(true)}
                >
                  <a
                    href='#'
                    className='button mt-80 bdr m-hide button-show w-button'
                  >
                    <strong className='bold-text-2'>Buy $DURINHO</strong>
                  </a>
                </div>
              </div>
            </div>

            <div className='faq-section'>
              <FAQItem
                question='What is $DURINHO?'
                answer="$DURINHO is Gilbert Burns' fan token. By owning $DURINHO, you will be able to engage with the athlete and other fan token holders, participate in contests, earn rewards, and vote in polls to influence significant decisions Gilbert has to make!"
              />
              <FAQItem
                question='How do I buy $DURINHO?'
                answer='Click the Buy $DURINHO button, enter your email, choose quantity, then either store in Winter wallet or your ETH wallet. Finally, pay with card.'
              />
              <FAQItem
                question='How do I participate in events?'
                answer='Once the FTO ends, events will appear. You can join using your fan tokens. They’re not consumed, so you can reuse them.'
              />

              <FAQItem question='' answer='' />
              <FAQItem question='' answer='' />
              <FAQItem question='' answer='' />
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR --- */}
      {showSidebar && (
        <>
          <div
            className='sidebar-overlay'
            onClick={() => setShowSidebar(false)}
          />

          <RightSidebar
            isOpen={showSidebar}
            onClose={() => setShowSidebar(false)}
          />
        </>
      )}
    </>
  )
}

export default DurinhoPage
