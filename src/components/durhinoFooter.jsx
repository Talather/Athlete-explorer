// function Footer () {
//   return (
//     <footer className='footer'>
//       <div className='footer-content'>
//         <div className='footer-left'>
//           <a href='https://twitter.com' target='_blank' rel='noreferrer'>
//             <i className='fab fa-twitter'></i>
//           </a>
//         </div>

//         <div className='footer-center'>
//           <p>Every day is a fan's day</p>
//         </div>

//         <div className='footer-right'>
//           <a href='#'>Terms and Conditions</a>
//           <a href='#'>Privacy Policy</a>
//         </div>
//       </div>

//       <div className='footer-bottom'>
//         <p>© 2023 FansDay | All rights reserved</p>
//       </div>
//     </footer>
//   )
// }

// export default Footer




















import React from 'react'
import './footer-styles.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className='footer' id='footer' style={{backgroundColor:'#f5f5f7'}}>
      <div className='card grey-bkg'>
        <div className='footer-area'>
          {/* Social Links */}
          <div className='social-links-grid _5vw-margin'>
            <a
              href='https://twitter.com/fansdayofficial'
              target='_blank'
              rel='noopener noreferrer'
              className='social-link w-inline-block'
            >
              <img
                src='/twitter_1.svg'
                alt='Twitter'
                width='20'
                loading='lazy'
              />
            </a>
          </div>

          {/* Tagline */}
          <p className='paragraph bold black'>Every day is a fan's day</p>

          {/* Policy Links */}
          <div>
            <a href='terms-of-use.html' className='footer-link normal'>
              Terms and Conditions
            </a>
            <a href='privacy-policy.html' className='footer-link normal ml-2'>
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Hidden Grid Footer for Desktop (shown via media query) */}
        <div className='footer-grid hide'>
          <div className='left-column'>
            <a href='index.html' className='logo-footer w-inline-block'>
              <img
                src='images/logo-final-1-1.png'
                alt='FansDay Logo'
                width='60'
                height='60'
                loading='lazy'
                className='image-9'
              />
            </a>
            <div className='footer-column'>
              <p className='paragraph bold black'>Every day is a fan's day</p>
            </div>
            <div className='social-links-grid _5vw-margin'>
              <a
                href='https://twitter.com/fansdayofficial'
                target='_blank'
                rel='noopener noreferrer'
                className='social-link w-inline-block'
              >
                <img
                  src='images/twitter_1.svg'
                  alt='Twitter'
                  width='20'
                  loading='lazy'
                />
              </a>
            </div>
          </div>

          <div className='align-left-and-vertical'>
            <a href='terms-of-use.html' className='footer-link normal'>
              Terms and Conditions
            </a>
          </div>
          <div className='align-left-and-vertical'>
            <a href='privacy-policy.html' className='footer-link normal'>
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='footer-bottom'>
          <div className='footer-credits'>
            © {currentYear} FansDay | All rights reserved
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

