import React from 'react';

const MobileSidebar = React.memo(({ athletes, title, onClick }) => {
  if (!athletes || athletes.length === 0) return null;

  return (
    <div className=''>
      <h3 className='text-sm font-semibold py-1 text-center border-b border-[#EBEBEB]'>{title}</h3>
      {athletes.map(athlete => (
        <button
          key={athlete.id}
          onClick={(e) => {
            // Prevent default to avoid any native scroll behavior
            e.preventDefault();
            onClick(athlete);
          }}
          className='w-full flex flex-col bg-white items-center gap-[6px] px-2 py-[10px] border-b border-[#EBEBEB]'
        >
          <img
            src={athlete.profilePicture || 'https://via.placeholder.com/40'}
            alt={athlete.firstName}
            className='size-[55px] object-cover rounded-full shrink-0'
          />
          <span className='text-sm font-bold'>${athlete.fanTokenSymbol}</span>
          <span className='text-[#969494] text-sm'>{athlete.sport}</span>
        </button>
      ))}
    </div>
  );
});

export default MobileSidebar;