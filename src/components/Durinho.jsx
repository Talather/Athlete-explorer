import FAQItem from '../components/FAQItem'
import '../styles/durhino.css'

// import FAQItem from './FAQItem'

function DurinhoPage () {
    return (
        <>
            <div className='header-logo'><img src='/sixer.gif' width={80} height={70} alt='Logo' className='' />
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
              src='https://www.youtube.com/embed/2vOg4nyveP8'
              frameBorder='0'
              allowFullScreen
              title='Durinho Video'
            ></iframe>
            <div className='timer-overlay'>
              The sale will end in <strong>21:28:32</strong>
            </div>
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
                <div className='pMain' >
                  <div style={{width:"81px",height:'81px',borderRadius:'50%'}}>
                <img src='https://i.imgur.com/1Q9Z1Zm.png' alt='Durinho' />
                </div>
              <div>
              <h2 style={{fontSize:'26px'}}>
                $DURINHO <span role='img'>🇧🇷</span>
              </h2>
              <p className='label'>Athlete</p></div>
                </div>
                
            <div className='publish'>
              <strong>FRIDAY</strong>
              <span>Publication time</span>
            </div>
              </div>
              
              

          <div className='name-block'>
            <h3>Gilbert "Durinho" Burns</h3>
            <p>Brazilian mixed martial artist, UFC Welterweight fighter</p>
              </div>
              







          <div className='token-info'>
            <div  style={{backgroundColor:'#fafafa' ,textAlign:'center',borderRadius:'04px', paddingTop:"15px",paddingBottom: '15px',paddingLeft:'75px',paddingRight:"75px"}}>
      
              <strong style={{fontSize:'27px'}}>100 000 $DURINHO</strong>
              <p style={{fontSize:'17px'}}>Tokens for sale</p>
                </div>
                
            <div style={{backgroundColor:'#fafafa' ,textAlign:'center',borderRadius:'04px', paddingTop:"15px",paddingBottom: '15px',paddingLeft:'75px',paddingRight:"75px"}}>
              <strong  style={{fontSize:'27px'}}>07/15/2023</strong>
              <p  style={{fontSize:'17px'}}>Token sale start date</p>
            </div>
              </div>
              <div style={{display:'flex',flexDirection:"row",justifyContent:'space-around'}}>

          <h3 className='price'>$5.00</h3>

                <button className='buy-durinho'>Buy $DURINHO</button>
                </div>

          <div className='faq-section'>
            <FAQItem question='What is $DURINHO?' />
            <FAQItem question='How do I buy $DURINHO?' />
            <FAQItem question='How do I participate in events?' />
          </div>
        </div>
      </div>
    </div></>
  )
}

export default DurinhoPage
