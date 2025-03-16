import { Routes, Route, Link } from 'react-router-dom'

function StickyBar() {
  return (
    <div className='bottom-bar-wrapper'>
    <div className='sticky-bar'>
        <div className='menu-item'>
          <Link to = '/'>
        <i className='fas fa-house'></i> Home
        </Link>
      </div>
      <div className='separator'></div>
      <div className='menu-item'>
         <Link to='/page'>
          <i className='fas fa-coins'></i> FTO
          </Link>
      </div>
      <div className='separator'></div>
      <div className='menu-item'>
        <i className='fa fa-wallet'></i> Wallet
      </div>
      <div className='separator'></div>
      <div className='menu-item'>
        <i className='fa fa-user'></i> Settings
      </div>
      <div className='separator'></div>
      <div className='menu-item'>
        <i className='fa fa-question-circle'></i> Help
      </div>
    </div></div>
  )
}

export default StickyBar
