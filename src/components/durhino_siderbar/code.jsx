import React, { useState } from 'react'
import './style.css'
import { motion, AnimatePresence } from 'framer-motion'

const sidebarVariants = {
  hidden: {
    x: '100%',
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.02,
      ease: 'easeInOut'
    }
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
}

const RightSidebar = ({ isOpen, currentFto,onClose }) => {
  const [quantity, setQuantity] = useState(0)
  const pricePerNFT = currentFto.Atheletes.fanTokenInitialPrice;
  const total = quantity * pricePerNFT

  const handleIncrease = e => {
    e.preventDefault()
    setQuantity(prev => prev + 1)
  }

  const handleDecrease = e => {
    e.preventDefault()
    setQuantity(prev => (prev > 0 ? prev - 1 : 0))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className='sidebar-overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.div
            className='right-sidebar'
            variants={sidebarVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >



            <img
  src='/closeButton.svg'
  alt='close'
  className='image-11 button-cancel'
  onClick={onClose}
  style={{ cursor: 'pointer' }}
            />
            


<div className='sidebar-content' >
              {/* LEFT SIDE – NFT Quantity */}
              










  <div className='sidebar-left'>
                <h1 className='heading'>${currentFto.Atheletes.fanTokenSymbol}</h1>
                


   <div className='parent-quan'>
    <div className='quantity-box'>
      <button className='btn1' onClick = { handleDecrease }
>−</button>
                    <span className='qty'>{ quantity}</span>
      <button className='btn2' onClick={handleIncrease}>+</button>
                  </div>
                 

    <div className='price-box'>
      <div className='price-row1'>
        <span>NFT price</span>
        <span>${currentFto.Atheletes.fanTokenInitialPrice}</span>
      </div>
      <div className='price-row2'>
        <span>Total</span>
                      <span>${total}</span>
      </div>
                  </div>
                   </div>
              </div>
              


              

  {/* RIGHT SIDE – Payment Section */}
  <div className='sidebar-right'>
    <form className='form-section'>
      <label>Email address</label>
      <input type='email' placeholder='Email address' />

      <label>NFT delivery</label>
      <div className='wallet-option'>
        <img src='/winterLogo.png' alt='Winter' />
        <div>
          <strong>Winter wallet</strong>
          <p>No Ethereum wallet? Winter will manage your NFT.</p>
        </div>
      </div>

      <div className='wallet-option'>
        <img src='/ethLogo.png' alt='ETH' />
        <div>
          <strong>Ethereum Wallet</strong>
          <p>Buy this NFT to an Ethereum wallet.</p>
        </div>
      </div>

      <label>Card number</label>
      <input type='text' placeholder='1234 1234 1234 1234' />

      <div className='row'>
        <div>
          <label>Expiration</label>
          <input type='text' placeholder='MM / YY' />
        </div>
        <div>
          <label>CVC</label>
          <input type='text' placeholder='CVC' />
        </div>
      </div>

      <label className='checkbox-wrapper'>
        <input type='checkbox' />I accept Fansday’s Terms and Conditions.
      </label>

      <button className='pay-button'>Pay with card</button>
    </form>
  </div>
</div>








            
          </motion.div>
        </>
      )}
    </AnimatePresence>





  )
}

export default RightSidebar
