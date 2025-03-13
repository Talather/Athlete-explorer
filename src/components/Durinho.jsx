// import FAQItem from '../components/FAQItem'
// import '../styles/durhino.css'

// // import FAQItem from './FAQItem'

// function DurinhoPage () {
//     return (
//         <>
//             <div className='header-logo'><img src='/sixer.gif' width={80} height={70} alt='Logo' className='' />
// </div>
//         <div className='header'>
//   <h1>DURINHO day (Round 1)</h1>
// </div>


//     <div className='durinho-wrapper'>
//           <div className='durinho-container'>
              
            
//         {/* Left: Video + Progress */}
//         <div className='durinho-left'>
//           <div className='video-wrapper'>
//             <iframe
//               src='https://www.youtube.com/embed/2vOg4nyveP8'
//               frameBorder='0'
//               allowFullScreen
//               title='Durinho Video'
//             ></iframe>
//             <div className='timer-overlay'>
//               The sale will end in <strong>21:28:32</strong>
//             </div>
//               </div>
              

//           <div className='tokens-left'>
//             Tokens left: <strong>14%</strong>
//             <div className='token-bar'>
//               <div className='filled' style={{ width: '14%' }}></div>
//             </div>
//           </div>
//         </div>

//         {/* Right: Info Card */}
//             <div className='durinho-right'>
              
//               <div className='profile'>
//                 <div className='pMain' >
//                   <div style={{width:"81px",height:'81px',borderRadius:'50%',marginRight:'7px'}}>
//                 <img src='/lsg.png' alt='Durinho' />
//                 </div>
//               <div>
//               <h2 style={{fontSize:'26px'}}>
//                 $DURINHO <span role='img'><img
//   style={{
//     width: '35px',
//     height: '25px',
//     borderRadius: '0px'
//   }}
//   src='/brazilian-flag.png'
//   alt='flag'
// />
// </span>
//               </h2>
//               <p className='label'>Athlete</p></div>
//                 </div>
                
//             <div className='publish'>
//               <strong>FRIDAY</strong>
//               <span>Publication time</span>
//             </div>
//               </div>
              
              

//           <div className='name-block'>
//             <h3>Gilbert "Durinho" Burns</h3>
//             <p>Brazilian mixed martial artist, UFC Welterweight fighter</p>
//               </div>
              







//           <div className='token-info'>
//             <div  style={{backgroundColor:'#fafafa' ,textAlign:'center',borderRadius:'04px', paddingTop:"15px",paddingBottom: '15px',paddingLeft:'75px',paddingRight:"75px"}}>
      
//               <strong style={{fontSize:'27px'}}>100 000 $DURINHO</strong>
//               <p style={{fontSize:'17px'}}>Tokens for sale</p>
//                 </div>
                
//             <div style={{backgroundColor:'#fafafa' ,textAlign:'center',borderRadius:'04px', paddingTop:"15px",paddingBottom: '15px',paddingLeft:'75px',paddingRight:"75px"}}>
//               <strong  style={{fontSize:'27px'}}>07/15/2023</strong>
//               <p  style={{fontSize:'17px'}}>Token sale start date</p>
//             </div>
//               </div>
//               <div style={{display:'flex',flexDirection:"row",justifyContent:'space-around',alignItems:'center',alignContent:"center"}}>

//           <h3 className='price' style={{marginLeft:'6vw'}}>$5.00</h3>

//                 {/* <button className='buy-durinho'>Buy $DURINHO</button> */}


// <span></span>
//                 <div className='fto-button-border-gradient' style={{marginLeft:'0px'}} >
//   <div
//     className='fto-button-wrappr'
//     // onClick={}
//   >
//     <a href='/k' className='button mt-80 bdr m-hide button-show w-button'>
//       <strong className='bold-text-2'>Buy $DURHINO</strong>
//     </a>
//   </div>
// </div>

//                 </div>

//           <div className='faq-section'>
//             <FAQItem question='What is $DURINHO?' answer="
// $DURINHO is Gilbert Burns' fan token. By owning $DURINHO, you will be able to engage with the athlete and other fan token holders, participate in contests, earn rewards, and vote in polls to influence significant decisions Gilbert has to make!"/>
//                 <FAQItem question='How do I buy $DURINHO?' answer="All you have to do is click the Buy $DURINHO button. You'll enter your email address and choose the quantity of fan tokens you want to buy. Please note each fan token counts as 1 voice in polls, so if you own 5 fan tokens, your vote will count for 5!

// When asked on which wallet you want to store your fan tokens, just click Winter if you have no Ethereum wallet. You won't have anything to do as your wallet will be created automatically and your tokens will be sent on it. Finally, you'll simply enter your debit/credit card details and receive your fan tokens."/>
//                 <FAQItem question='How do I participate in events?' answer = "Within one week after the FTO is finished, the first event will be posted and you will be able to participate with your fan tokensNB : When you participate in an event (a poll for example) your fan tokens are not spent, this means you won't have to buy new fan tokens to participate in new events. You can participate in as many events as the creator posts with as little as 1 fan token."
// /></div>
//         </div>
//       </div>
//     </div></>
//   )
// }

// export default DurinhoPage


























import React, { useState } from 'react'
import FAQItem from '../components/FAQItem'
import RightSidebar from '../components/durhino_siderbar/code' // Sidebar component
import '../styles/durhino.css'
import '../components/durhino_siderbar/style.css'
import TimerOverlay from './timeOverlay'

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
              <iframe
                src='https://www.youtube.com/embed/wsCmWZSASes'
                frameBorder='0'
                allowFullScreen
                title='Durinho Video'
              ></iframe>
              {/* <div className='timer-overlay'>
                The sale will end in <strong>21:28:32</strong>
              </div> */}

              <TimerOverlay/>
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
                  <h2 style={{ fontSize: '26px' }}>
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
              <h3>Gilbert &quot;Durinho&quot; Burns</h3>
              <p>Brazilian mixed martial artist, UFC Welterweight fighter</p>
            </div>

            <div className='token-info'>
              <div
                style={{
                  backgroundColor: '#fafafa',
                  textAlign: 'center',
                  borderRadius: '4px',
                  padding: '15px 65px'
                }}
              >
                <strong style={{ fontSize: '27px' }}>100 000 $DURINHO</strong>
                <p style={{ fontSize: '21px' }}>Tokens for sale</p>
              </div>

              <div
                style={{
                  backgroundColor: '#fafafa',
                  textAlign: 'center',
                  borderRadius: '4px',
                  padding: '15px 65px'
                }}
              >
                <strong style={{ fontSize: '27px' }}>07/15/2023</strong>
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
              <h3 className='price' style={{ marginLeft: '6vw' }}>
                $5.00
              </h3>

              <div
                className='fto-button-border-gradient'
                style={{ marginLeft: '0px' }}
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
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR --- */}
      {showSidebar && (
        <>
        <div className='sidebar-overlay' onClick={() => setShowSidebar(false)} />

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
