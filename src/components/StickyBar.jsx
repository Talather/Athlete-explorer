import { NavLink } from 'react-router-dom'

function StickyBar() {
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='stickyBarWrapper max-w-[698px] w-full bg-[#E7E7E7] rounded-t-[30px] flex items-center justify-center gap-2 min-[430px]:gap-[18px]'>
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
          <i className='fas fa-coins'></i> <span> FTO </span>
        </NavLink>

        <NavLink
          to='/wallet'
          className={({ isActive }) =>
            `stickyBarLink ${isActive ? 'stickyBarActiveLink' : ''}`
          }
        >
          <i className='fa fa-wallet'></i> <span> Wallet </span>
        </NavLink>

        <NavLink
          to='/settings'
          className={({ isActive }) =>
            `stickyBarLink ${isActive ? 'stickyBarActiveLink' : ''}`
          }
        >
          <i className='fa fa-user'></i> <span> Settings </span>
        </NavLink>

        <NavLink
          to='/help'
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
