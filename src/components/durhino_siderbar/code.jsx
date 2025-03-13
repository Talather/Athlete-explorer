
import React, { useState } from 'react'
import './style.css'

const RightSidebar = ({ isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(0)
  const pricePerNFT = 5

  const handleIncrease = e => {
    e.preventDefault()
    setQuantity(prev => prev + 1)
  }

  const handleDecrease = e => {
    e.preventDefault()
    setQuantity(prev => (prev > 0 ? prev - 1 : 0))
  }

  const total = quantity * pricePerNFT

  return (
    <div className={`right-sidebar ${isOpen ? 'open' : ''}`}>
      <img
        src='/closeButton.svg'
        alt='close'
        className='image-11 button-cancel'
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />

      <div className='div-block-16'>
        <h1 className='heading-7'>$DURINHO</h1>

        {/* Quantity + Price Card */}
        <div className='div-block-17'>
          <div className='email-form-2 w-form'>
            <form className='form'>
              <div className='div-block-18'>
                <a
                  href='#'
                  className='btn-minus w-button'
                  onClick={handleDecrease}
                >
                  −
                </a>
                <input
                  type='number'
                  className='input-number w-input'
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  min={0}
                  placeholder='0'
                />
                <a
                  href='#'
                  className='btn-plus w-button'
                  onClick={handleIncrease}
                >
                  +
                </a>
              </div>

              <div className='columns-4 w-row'>
                <div className='w-col w-col-6'>
                  <h5 className='heading-8'>NFT price</h5>
                </div>
                <div className='w-col w-col-6'>
                  <h5 className='heading-8 right'>
                    <strong>${pricePerNFT}</strong>
                  </h5>
                </div>
              </div>

              <div className='columns-3 w-row'>
                <div className='w-col w-col-6'>
                  <div className='text-block-10 font-size'>Total</div>
                </div>
                <div className='w-col w-col-6'>
                  <h5 className='heading-8 right total-price'>
                    <strong>${total}</strong>
                  </h5>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Email, Wallet & Payment Fields */}
        <div className='div-block-17 spc-0'>
          <div className='w-form'>
            <form className='form'>
              <div className='div-block-19'>
                <label className='field-label'>Email address</label>
                <input
                  type='text'
                  className='text-field w-input'
                  placeholder='Email address'
                  required
                />
              </div>

              <label className='field-label l-10'>NFT delivery</label>
              <div className='div-block-19 bg'>
                <div className='div-block-19 flx'>
                  <img src='/winterLogo.png' width='25' alt='Winter' />
                  <h6 className='heading-9'>Winter wallet</h6>
                </div>
                <div className='text-block-11'>
                  No Ethereum wallet? No worries, Winter will store and manage
                  your NFT for you.
                </div>
              </div>

              <div className='div-block-19 bg'>
                <div className='div-block-19 flx'>
                  <img src='/ethLogo.png' width='25' alt='ETH' />
                  <h6 className='heading-9'>
                    <strong className='bold-text-5'>
                      Ethereum-supported Wallet Address
                    </strong>
                  </h6>
                </div>
                <div className='text-block-11'>
                  Buy this NFT to an Ethereum wallet.
                </div>
                <div className='tgl'>
                  <input
                    type='text'
                    className='text-field mm w-input'
                    placeholder='e.g. 0xe0CB5... or joe.eth'
                    required
                  />
                  <div className='text-block-11 c'>or</div>
                  <input
                    type='submit'
                    value='Connect your ETH wallet'
                    className='submit-button w-button'
                    style={{ backgroundColor: 'black' }}
                  />
                  <div className='text-block-11 c'>
                    <strong>
                      🚨 WARNING! Do NOT enter a Coinbase address. Only use a
                      wallet you control.
                    </strong>
                  </div>
                </div>
              </div>

              <div className='div-block-19'>
                <label className='field-label'>Card number</label>
                <input
                  type='text'
                  className='text-field w-input'
                  placeholder='1234 1234 1234 1234'
                  required
                />
              </div>

              <div className='w-row'>
                <div className='column-4 w-col w-col-6'>
                  <div className='div-block-19 mt-10 mr-10'>
                    <label className='field-label'>Expiration</label>
                    <input
                      type='text'
                      className='text-field w-input'
                      placeholder='MM / YY'
                      required
                    />
                  </div>
                </div>
                <div className='column-5 w-col w-col-6'>
                  <div className='div-block-19 mt-10'>
                    <label className='field-label'>CVC</label>
                    <input
                      type='text'
                      className='text-field w-input'
                      placeholder='CVC'
                      required
                    />
                  </div>
                </div>
              </div>

              <div className='div-block-19 mt-10 r-10 hide'>
                <label className='field-label'>Country</label>
                <select className='text-field w-select'>
                  <option value=''>Select one...</option>
                  <option value='First'>First choice</option>
                  <option value='Second'>Second choice</option>
                  <option value='Third'>Third choice</option>
                </select>
              </div>

              <label className='w-checkbox checkbox-field'>
                <input type='checkbox' className='w-checkbox-input' />
                <span className='checkbox-label w-form-label'>
                  I accept Fansday's Terms and Conditions.
                </span>
              </label>

              <div style={{ marginTop: '20px', width: '100%' }}>
                <a
                  href='#'
                  className='_w-100 mt-10 w-button black-section'
                  style={{
                    backgroundColor: 'black',
                    paddingLeft: '50px',
                    paddingRight: '50px'
                  }}
                >
                  Pay with card
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar
