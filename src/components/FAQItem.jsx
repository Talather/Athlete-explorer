import { useState } from 'react'
// import './faq.css'
import ArrowDown from '/arrow-down-sign-to-navigate.svg' // adjust path as needed

function FAQItem ({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`faq-item ${open ? 'open' : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className='faq-question'>
        <span className='faq-text'>{question}</span>
        <img
          src={ArrowDown}
          alt='Toggle FAQ'
          className={`faq-arrow ${open ? 'rotate' : ''}`}
        />
      </div>
      <div className={`faq-answer ${open ? 'show' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default FAQItem
