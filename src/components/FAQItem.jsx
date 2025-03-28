import { useState, useRef } from 'react'
import ArrowDown from '/arrow-down-sign-to-navigate.svg'

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)

  return (
    <div
      className={`bg-[#FFFFFF7D] faq-button rounded-[8px] px-3 py-4 sm:py-5 sm:px-9 cursor-pointer transition-all duration-300 ${open ? 'open' : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className='faq-question gap-1 flex justify-between items-center cursor-pointer'>
        <span className='text-lg sm:text-[22px] leading-normal text-[#1D1D1F] font-bold'>
          {question}
        </span>
        <img
          src={ArrowDown}
          alt='Toggle FAQ'
          className={`size-4 sm:size-6 transition-transform duration-[1s] ${open ? 'rotate-180' : ''}`}
        />
      </div>
      <div
        ref={contentRef}
        className="transition-all duration-[1s] overflow-hidden"
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight}px` : '0px'
        }}
      >
        <p className="text-base sm:text-[20px] leading-normal font-bold pt-5">{answer}</p>
      </div>
    </div>
  )
}

export default FAQItem
