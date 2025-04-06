import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div className='navbar shadow-md'>
      <nav className='w-full flex justify-center'>
        <Link to="/" class="sm:p-[10px]">
          <img sizes="auto" alt="Logo" class="w-[75px] h-[70px] px-[10px] py-[7.5px] 
            sm:w-[80px] sm:h-[80px] sm:px-0 sm:py-0" src="/sixer.gif"/>
        </Link>
       
      </nav>
    </div>
  )
}

export default Navbar
