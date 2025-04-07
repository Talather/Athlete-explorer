import { useState, useEffect } from 'react'

function Sidebar ({ athletes, onSelect, isBlurred }) {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState(athletes)

  useEffect(() => {
    setFiltered(
      athletes.filter(athlete =>
        athlete.firstName.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search, athletes])

  return (
    <div className={`max-w-[300px] w-full bg-[#FAFAFB] h-full relative overflow-hidden border border-[#EBEBEB] shadow-sm rounded-3xl
      ${isBlurred ? "blur-md" : ""}`}
    >
      <div className='w-full primary-gradient h-2 rounded-t-3xl sticky top-0'></div>
      
      <div className='p-6 space-y-4 h-full overflow-y-auto'>
        <h2 className='text-3xl font-bold'>Athletes</h2>
        
        <div className='border rounded-[16px] border-[#E7E7E7] py-3 px-5'>
          <input
            className='focus:outline-none bg-transparent'
            type='text'
            placeholder='Search for an athlete...'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <span className='clear-icon' onClick={() => setSearch('')}>
              &times;
            </span>
          )}
        </div>

        <ul className='flex flex-col items-center w-full gap-3'>
          {filtered.map((athlete, index) => (
            <li key={index} onClick={() => onSelect(athlete)}
              className='w-full h-[73px] primary-gradient overflow-hidden p-px rounded-3xl shadow-md cursor-pointer'
            >
              <div className='bg-white w-full h-full flex gap-2 rounded-[23px] py-[10px] px-4 
                transition-all duration-300 hover:bg-gray-100'
              >
                <div className='size-[55px] rounded-full overflow-hidden shrink-0'>
                  <img src={athlete.profilePicture} alt={athlete.firstName} className='size-full object-cover'/>
                </div>
                <div>
                  <p className='font-bold text-base'>{athlete.firstName}  {athlete.lastName}</p>
                  <div className='text-[#969494] text-sm'>
                    Athlete
                  </div>
                </div>
              </div>
              
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  )
}

export default Sidebar
