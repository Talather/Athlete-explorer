import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import { client } from './../../client';
import { useProfiles } from "thirdweb/react";

const RightSidebar = ({ isOpen, currentFto, onClose }) => {
//  if (!profiles || profiles.length === 0) return;
  const { data: profiles } = useProfiles({
    client,
  });
  console.log(profiles);
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Disable body scroll
    } else {
      document.body.style.overflow = 'auto'; // Restore body scroll
    }

    return () => {
      document.body.style.overflow = 'auto'; // Ensure cleanup on unmount
    };
  }, [isOpen]);

  return (
    <div className={`fixed top-0 right-0 h-screen overflow-y-auto sidebar-shadow
            bg-[#F0F0F0] transition-all duration-300 z-50 w-full max-w-[767px]
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >

      <img
        src='/closeButton.svg'
        alt='close'
        className='size-8 p-[5px] bg-white rounded-full absolute left-2 top-2'
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />

      <div className='flex flex-col sm:flex-row h-full'>
        {/* LEFT SIDE – NFT Quantity */}

        <div className='sm:max-w-[316px] w-full p-5 space-y-10'>
          <h1 className='p-[10px] text-[30px] text-center font-bold leading-none'>${currentFto.Atheletes.fanTokenSymbol}</h1>

          <div className='custom-shadow bg-white rounded-[20px] py-5 divide-y-2 w-full'>

            <div className='pb-[20px] px-[10px] flex justify-between'>
              <button className='btn-plus text-[26px] rounded-tl-[9px] rounded-bl-[9px] px-[15px] text-white font-bold' onClick={handleDecrease}>−</button>

              <input type="number" min={0} value={quantity}
                className='text-center border border-[#ccc] w-full text-[#333] text-sm py-2 px-3 outline-none focus:border-blue-400 font-[600]'
              />

              <button className='btn-minus text-[26px] rounded-tr-[9px] rounded-br-[9px] px-[15px] text-white font-bold' onClick={handleIncrease}>+</button>
            </div>


            <div className='text-xl font-bold divide-y-2'>
              <div className='flex items-center justify-between px-[10px] py-[13px]'>
                <span>NFT price</span>
                <span>${currentFto.Atheletes.fanTokenInitialPrice}</span>
              </div>
              <div className='flex items-center justify-between px-[10px] py-[13px]'>
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>

        </div>

       {profiles?.length > 0 ? (
          <div className='bg-white custom-shadow py-10 px-[30px] h-full'>
          <htmlForm className='text-[#1D1D1F] h-full flex flex-col justify-between gap-[10px]'>

            <div className='flex flex-col w-full gap-1'>
              <label htmlFor="field-2" className="text-base font-bold">Email address</label>
              <input className="py-2 px-3 rounded outline-none custom-shadow
                  border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                maxLength="256" name="field-2"
                data-name="Field 2" placeholder="Email address"
                type="email" id="field-2" required=""
              />
            </div>

            <div id="myList" className='flex flex-col gap-[10px]'>
              
              <div className="flex flex-col gap-1">
                <label htmlFor="field-2" className="text-base font-bold">NFT delivery</label>
                <div className="border-[1px] border-[#ccc] rounded-[10px] px-[20px] py-[16px]">
                  
                  <div className="flex items-center gap-[10px]">
                    <img src="/winterLogo.png" loading="lazy" alt="cold" className='w-[25px] shrink-0' />
                    <h6 className="text-base font-bold">Winter wallet</h6>
                  </div>

                  <div className="text-sm leading-snug text-[#00000099]">
                    No Ethereum wallet? No worries, Winter will store and manage your NFT htmlFor you.
                  </div>

                </div>
              </div>

              <div className={`border-[1px] flex flex-col cursor-pointer transition-all duration-300 gap-2 border-[#ccc] rounded-[10px] px-[20px] py-[16px]
                  ${open ? 'bg-[#f1f1f1]': ''}
                `}>
                
                <div onClick={() => setOpen(!open)} className='flex flex-col gap-1'>
                  <div className="flex items-start gap-[10px]">
                    <img src='/ethLogo.png' alt='ETH' loading="lazy" className="w-[25px] shrink-0" />
                    <h6 className="text-base font-bold">
                      Ethereum-supported Wallet Address
                    </h6>
                  </div>
                  <div className="text-sm leading-snug text-[#00000099] w-full text-left">
                    Buy this NFT to a Ethereum wallet.<br />
                  </div>
                </div>

                <div ref={contentRef}
                  className="flex items-center flex-col collapse-item gap-2 overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: open ? `${contentRef.current?.scrollHeight}px` : '0px'
                  }}
                >
                  <input className="py-2 px-3 rounded outline-none custom-shadow
                    border-[1px] border-[#ccc] w-full focus:border-blue-400 font-[600]"
                    maxLength="256" name="field-3"
                    data-name="Field 2" placeholder="e.g. 0xe0CB5... or joe.crypto, joe.eth, ..."
                    type="text" id="field-3" required=""
                  />
                  <div className="text-sm text-[#00000099] text-center">or</div>
                  
                  <input type="submit" data-wait="Please wait..." 
                    className="text-center bg-[#0e76fd] font-bold rounded-[5px] px-[15px] py-[9px] text-white" 
                    value="Connect your ETH wallet" 
                  />
                  <div className="text-[#00000099] text-center text-sm font-bold leading-tight">
                    🚨 WARNING! Do NOT enter in a Coinbase address. Only enter in a wallet you have the private keys to. We can't help in case of a mistake.
                  </div>
                </div>

              </div>
            </div>

            <div className='flex flex-col w-full gap-1'>
              <label htmlFor="card-number" className="text-base font-bold">Card number</label>
              <input className="py-2 px-3 rounded outline-none custom-shadow
                  border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                maxLength="256" name="card-number"
                data-name="card-number" placeholder="1234 1234 1234 1234"
                type="text" id="card-number"
              />
            </div>

            <div className='grid grid-cols-2 items-center gap-3'>

              <div className='flex flex-col w-full gap-1'>
                <label htmlFor="expiration" className="text-base font-bold">Expiration</label>
                <input className="py-2 px-3 rounded outline-none custom-shadow
                    border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                  maxLength="256" name="expiration"
                  data-name="expiration" placeholder="MM / YY"
                  type="text" id="expiration"
                />
              </div>

              <div className='flex flex-col w-full gap-1'>
                <label htmlFor="cvc" className="text-base font-bold">CVC</label>
                <input className="py-2 px-3 rounded outline-none custom-shadow
                    border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                  maxLength="256" name="cvc"
                  data-name="cvc" placeholder="CVC"
                  type="text" id="cvc"
                />
              </div>

            </div>

            <label className='flex items-center gap-1 text-sm font-bold'>
              <input type='checkbox' />I accept Fansday’s Terms and Conditions.
            </label>

            <button className='inline-block text-center w-full rounded-[10px] text-base font-bold bg-black text-white p-[10px]'>
              Pay with card
            </button>

          </htmlForm>
        </div>
       ) : (
        <div className='bg-white w-full custom-shadow py-10 px-[30px] h-full text-center'>
          <h3 className="text-2xl font-bold">Please connect your wallet first</h3>
        </div>
       )}
      </div>
    </div>
  )
}

export default RightSidebar
