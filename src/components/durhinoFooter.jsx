function Footer () {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-left'>
          <a href='https://twitter.com' target='_blank' rel='noreferrer'>
            <i className='fab fa-twitter'></i>
          </a>
        </div>

        <div className='footer-center'>
          <p>Every day is a fan's day</p>
        </div>

        <div className='footer-right'>
          <a href='#'>Terms and Conditions</a>
          <a href='#'>Privacy Policy</a>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© 2023 FansDay | All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer
