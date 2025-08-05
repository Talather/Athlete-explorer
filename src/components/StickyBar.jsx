import { NavLink } from 'react-router-dom'

function StickyBar() {
  return (
    <div className='w-full flex items-center justify-center relative z-[999]'>
      <div className='stickyBarWrapper max-w-[698px] w-full bg-[#EEEEEE] rounded-t-[30px] flex items-center justify-center gap-2 min-[430px]:gap-[18px] overflow-x-hidden'>
        <NavLink
          to='/'
          end
          className={({ isActive }) =>
            `stickyBarLink ${isActive ? 'stickyBarActiveLink' : ''}`
          }
        >
          <i className='fas fa-house'></i> <span> Home </span>
        </NavLink>

        <NavLink
          to='/page'
          className={({ isActive }) =>
            `stickyBarLink ${isActive ? 'stickyBarActiveLink' : ''}`
          }
        >
          <i className='fas fa-coins'></i> <span> Sale </span>
        </NavLink>

       
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `stickyBarLink ${isActive ? 'stickyBarActiveLink' : ''}`
          }
        >
          <i className='fa fa-user'></i> <span> Profile </span>
        </NavLink>

        <NavLink
          to='/settings'
          className={({ isActive }) =>
            `stickyBarLink ${isActive ? 'stickyBarActiveLink' : ''}`
          }
        >
          <i className='fa fa-gear'></i> <span> Settings </span>
        </NavLink>

        <NavLink
          to='https://fansday.tawk.help/ '
          target='__blank'
          className={({ isActive }) =>
            `stickyBarLink ${isActive ? 'stickyBarActiveLink' : ''}`
          }
        >
          <i className='fa fa-question-circle'></i> <span> Help </span>
        </NavLink>
      </div>
    </div>
  )
}

export default StickyBar
