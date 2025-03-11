import { useState } from 'react'

function FAQItem ({ question }) {
  const [open, setOpen] = useState(false)

  return (
    <div className='faq-item' onClick={() => setOpen(!open)}>
      <div className='faq-question'>
        <span>{question}</span>
        <span>{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div className='faq-answer'>
          <p>This is the answer to "{question}".</p>
        </div>
      )}
    </div>
  )
}

export default FAQItem
