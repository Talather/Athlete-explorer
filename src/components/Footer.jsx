import { useEffect } from 'react'
import { FaXTwitter, FaInstagram, FaDiscord } from 'react-icons/fa6'

function Footer () {
  useEffect(() => {
    const yearEl = document.getElementById('year')
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear()
    }
  }, [])

  return (
    <div className='footer'>
      <div className='footer-container'>
        <div className='footer-menu'>
          <h3>Legal</h3>
          <ul>
            <li>
              <a href='#'>Cookies Policy</a>
            </li>
            <li>
              <a href='#'>Privacy Policy</a>
            </li>
            <li>
              <a href='#'>Terms of Use</a>
            </li>
          </ul>
        </div>
        <div className='footer-menu'>
          <h3>Company</h3>
          <ul>
            <li>
              <a href='#'>About Us</a>
            </li>
            <li>
              <a href='#'>Blog</a>
            </li>
            <li>
              <a href='#'>Support</a>
            </li>
          </ul>
        </div>
        <div className='social-links flex flex-col items-center'>
          <h3>Follow Us</h3>
          {/* <div className='social-icons'>
            <a href='#'>
              <i className='fab fa-instagram'></i>
            </a>
            <a href='#'>
              <i className='fab fa-x-twitter'></i>
            </a>
            <a href='#'>
              <i className='fab fa-discord'></i>
            </a>
            <a href='#'>
              <i className='fab fa-telegram'></i>
            </a>
            <a href='#'>
              <i className='fab fa-tiktok'></i>
            </a>
          </div> */}
           <div className='social-icons'>
            {/* X (Twitter) */}
            <a
              href='https://twitter.com/yourprofile'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='X'
            >
              <FaXTwitter />
            </a>
          
            {/* Instagram */}
            <a
              href='https://instagram.com/yourprofile'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <FaInstagram />
            </a>
          
            {/* Discord */}
            <a
              href='https://discord.gg/yourserver'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Discord'
            >
              <FaDiscord />
            </a>
          </div>
        </div>
      </div>
      <div className='copyright'>
        <p>
          &copy; <span id='year'></span> All Rights Reserved
        </p>
      </div>
    </div>
  )
}

export default Footer
