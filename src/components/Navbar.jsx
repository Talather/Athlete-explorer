import { Routes, Route, Link } from 'react-router-dom'

function Navbar () {
  return (
    <div className='navbar'>
      <nav>
        <Link to='/page'>
          <div className='logo'>Athlete Explorer </div>
        </Link>
      </nav>
    </div>
  )
}

export default Navbar
