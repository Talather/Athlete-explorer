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
    <div className={`sidebar ${isBlurred ? 'blurred' : ''}`}>
      <h2 className='sidebar-text'>Athletes</h2>
      <div className='search-bar'>
        <input
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
      <ul className='athlete-list'>
        {filtered.map((athlete, index) => (
          <li key={index} onClick={() => onSelect(athlete)}>
            <img src={athlete.profilePicture} alt={athlete.firstName} />
            <p>{athlete.firstName}  {athlete.lastName}</p>
            
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
