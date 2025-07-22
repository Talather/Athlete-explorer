import { useState, useEffect } from 'react';

function Sidebar({ allAthletes, athletes, onSelect, isBlurred }) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(athletes);
  const [filteredAllAthletes, setFilteredAllAthletes] = useState(allAthletes);


  useEffect(() => {
    const searchLower = search.toLowerCase();

    const filteredSubset = athletes.filter(athlete =>
      (athlete.fanTokenSymbol?.toLowerCase() || '').includes(searchLower)
    );
    setFiltered(filteredSubset);

    const filteredAll = allAthletes.filter(athlete =>
      (athlete.fanTokenSymbol?.toLowerCase() || '').includes(searchLower)
    );
    setFilteredAllAthletes(filteredAll);
  }, [search, athletes, allAthletes]);


  const withAccess = filtered.filter(a => a.hasAccess);
  const withoutAccess = filtered.filter(a => !a.hasAccess);

  // console.log("desktop all athletes", allAthletes);
  // console.log("desktop with access athletes", withAccess);
  // console.log("desktop without access athletes", withoutAccess);

  return (
    <div className={`max-w-[300px] w-full bg-[#FAFAFB] h-full relative overflow-hidden border border-[#EBEBEB] shadow-sm rounded-3xl
      ${isBlurred ? "blur-lg pointer-events-none" : ""}`}>

      <div className='w-full primary-gradient h-2 rounded-t-3xl sticky top-0'></div>

      <div className='p-6 space-y-4 h-full overflow-y-auto'>
        <h2 className='text-3xl font-bold'>Athletes</h2>

        <div className='border rounded-[16px] border-[#E7E7E7] py-3 px-5'>
          <input
            className='focus:outline-none bg-transparent w-full'
            type='text'
            placeholder='Search for an athlete...'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <span className='clear-icon' onClick={() => setSearch('')}>&times;</span>
          )}
        </div>

        {(withAccess.length > 0 || withoutAccess.length > 0) ? (
          <div className='w-full'>
            {withAccess.length > 0 && (
              <div>
                <h3 className='text-lg font-semibold mt-2 mb-2'>My Athletes 🎯</h3>
                <ul className='flex flex-col items-center w-full gap-3'>
                  {withAccess.map((athlete, index) => (
                    <button
                      key={`access-${index}`}
                      onClick={() => onSelect(athlete)}
                      className='w-full h-[73px] primary-gradient overflow-hidden p-px rounded-3xl shadow-md cursor-pointer'
                    >
                      <span className='bg-white w-full h-full gap-2 rounded-[23px] py-[10px] px-4 
                        transition-all duration-300 hover:bg-gray-100 flex items-center'>
                        <span className='size-[55px] rounded-full overflow-hidden shrink-0'>
                          <img src={athlete.profilePicture} alt={athlete.firstName} className='size-full object-cover' />
                        </span>
                        <span>
                          <p className='font-bold text-base'>${athlete.fanTokenSymbol}</p>
                          <span className='text-[#969494] text-sm'>{athlete.sport}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </ul>
              </div>
            )}

            {withoutAccess.length > 0 && (
              <div>
                <h3 className='text-lg font-semibold mt-6 mb-2'>Locked Athletes 🔒</h3>
                <ul className='flex flex-col items-center w-full gap-3'>
                  {withoutAccess.map((athlete, index) => (
                    <button
                      key={`locked-${index}`}
                      onClick={() => onSelect(athlete)}
                      className='w-full h-[73px] primary-gradient overflow-hidden p-px rounded-3xl shadow-md cursor-pointer'
                    >
                      <span className='bg-white w-full h-full gap-2 rounded-[23px] py-[10px] px-4 
                        transition-all duration-300 hover:bg-gray-100 flex items-center'>
                        <span className='size-[55px] rounded-full overflow-hidden shrink-0'>
                          <img src={athlete.profilePicture} alt={athlete.firstName} className='size-full object-cover' />
                        </span>
                        <span>
                          <p className='font-bold text-base'>${athlete.fanTokenSymbol}</p>
                          <span className='text-[#969494] text-sm'>{athlete.sport}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className='w-full'>
            {filteredAllAthletes.length > 0 && (
              <div>
                <h3 className='text-lg font-semibold mt-6 mb-2'>Locked Athletes 🔒</h3>
                <ul className='flex flex-col items-center w-full gap-3'>
                  {filteredAllAthletes.map((athlete, index) => (
                    <button
                      key={`locked-${index}`}
                      onClick={() => onSelect(athlete)}
                      className='w-full h-[73px] primary-gradient overflow-hidden p-px rounded-3xl shadow-md cursor-pointer'
                    >
                      <span className='bg-white w-full h-full gap-2 rounded-[23px] py-[10px] px-4 
                        transition-all duration-300 hover:bg-gray-100 flex items-center'>
                        <span className='size-[55px] rounded-full overflow-hidden shrink-0'>
                          <img src={athlete.profilePicture} alt={athlete.firstName} className='size-full object-cover' />
                        </span>
                        <span>
                          <p className='font-bold text-base'>${athlete.fanTokenSymbol}</p>
                          <span className='text-[#969494] text-sm'>{athlete.sport}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Sidebar;
