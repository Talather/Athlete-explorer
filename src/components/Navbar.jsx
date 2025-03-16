

import { useEffect, useState } from 'react'

function Navbar() {
  const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= 768) // Adjust breakpoint as needed
  }

  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  return () => window.removeEventListener('resize', checkScreenSize)
}, [])

  return (
    <div className='navbar'>
      <nav>
       
        <div className='logo'><img style={isMobile ? { height:'55px',width:'55px'} : { height:'80px',width:'80px'}} src={'/sixer.gif'}></img></div>
       
      </nav>
    </div>
  )
}

export default Navbar
