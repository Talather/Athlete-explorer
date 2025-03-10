function StickyBar () {
  return (
    <div className='sticky-bar'>
      <div className='menu-item'>
        <i className='fas fa-house'></i> Home
      </div>
      <div className='separator'></div>
      <div className='menu-item'>
        <i className='fas fa-coins'></i> FTO
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
    </div>
  )
}

export default StickyBar
