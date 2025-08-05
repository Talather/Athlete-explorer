import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi'
import AthleteCardButton from './AthleteCardButton';

function Sidebar({ allAthletes, athletes, onSelect, isBlurred, search, setSearch, setSearchVisible }) {
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

  const toggleSearchVisible = () => {
    setSearchVisible(prev => !prev);
  };


  // console.log("desktop all athletes", allAthletes);
  // console.log("desktop with access athletes", withAccess);
  // console.log("desktop without access athletes", withoutAccess);

  return (
    <div className={`max-w-[90px] min-[400px]:max-w-[115px] sm:max-w-[220px] lg:max-w-[300px] w-full 
        bg-[#FAFAFB] h-full relative overflow-hidden border 
          border-[#EBEBEB] border-t-0 shadow-sm rounded-r-3xl md:rounded-3xl
      ${isBlurred ? "blur-lg pointer-events-none" : ""}`}>

      <div className='w-full primary-gradient h-2 sticky top-0'></div>

      <div className='sm:p-3 lg:p-6 sm:space-y-3 h-full overflow-y-auto'>
        <h2 className='text-3xl font-bold hidden sm:block'>Athletes</h2>

        <button
          className='w-full p-[12px] flex sm:hidden items-center gap-1 border-b border-[#EBEBEB]'
          onClick={toggleSearchVisible}
        >
          <FiSearch size={20} />
          <span className='text-black font-bold'>Search</span>
        </button>

        {/* search area start */}
        <div className='hidden sm:block border rounded-[16px] border-[#E7E7E7] py-3 px-5'>
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
                <h3 className='font-semibold text-sm text-center border-b border-[#EBEBEB]
                  sm:text-lg py-2 sm:text-start sm:border-none'>
                  🎯 My Athletes
                </h3>

                <ul className='flex flex-col items-center w-full sm:gap-3'>
                  {withAccess.map((athlete, index) => (
                    <AthleteCardButton
                      key={`access-${index}`}
                      athlete={athlete}
                      onSelect={() => onSelect(athlete)}
                    />
                  ))}
                </ul>
              </div>
            )}

            {withoutAccess.length > 0 && (
              <div>
                <h3 className='font-semibold text-sm text-center border-b border-[#EBEBEB]
                  sm:text-lg py-2 sm:text-start sm:border-none'>
                  🔒 Locked Athletes
                </h3>
                <ul className='flex flex-col items-center w-full sm:gap-3'>
                  {withoutAccess.map((athlete, index) => (
                    <AthleteCardButton
                      key={`access-${index}`}
                      athlete={athlete}
                      onSelect={() => onSelect(athlete)}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className='w-full'>
            {filteredAllAthletes.length > 0 && (
              <div>
                <h3 className='font-semibold text-sm text-center border-b border-[#EBEBEB]
                  sm:text-lg py-2 sm:text-start sm:border-none'>
                  🔒 Locked Athletes
                </h3>
                <ul className='flex flex-col items-center w-full sm:gap-3'>
                  {filteredAllAthletes.map((athlete, index) => (
                    <AthleteCardButton
                      key={`access-${index}`}
                      athlete={athlete}
                      onSelect={() => onSelect(athlete)}
                    />
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
