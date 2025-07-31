import React from 'react';

const AthleteCardButton = ({ athlete, onSelect }) => {
    return (
        <>
            {/* desktop button start */}
            <button
                onClick={() => onSelect()}
                className='hidden sm:inline-block w-full h-[73px] primary-gradient overflow-hidden p-px rounded-3xl shadow-md cursor-pointer'
            >
                <span className='bg-white w-full h-full gap-2 rounded-[23px] py-[10px] px-4 
                    transition-all duration-300 hover:bg-gray-100 flex items-start'>
                    <span className='size-[55px] rounded-full overflow-hidden shrink-0'>
                        <img
                            src={athlete.profilePicture}
                            alt={athlete.firstName}
                            className='size-full object-cover'
                        />
                    </span>
                    <span className='leading-[1.25] text-center w-full flex flex-col items-start'>
                        <p className='font-bold text-base'>${athlete.fanTokenSymbol}</p>
                        <span className='text-[#969494] text-sm'>{athlete.sport}</span>
                    </span>
                </span>
            </button>

            {/* mobile button start */}
            <button
                onClick={() => onSelect()}
                className='w-full flex sm:hidden flex-col bg-white items-center gap-[8px] px-2 py-[10px] border-b border-[#EBEBEB]'
            >
                <img
                    src={athlete.profilePicture || 'https://via.placeholder.com/40'}
                    alt={athlete.firstName}
                    className='size-[55px] object-cover rounded-full shrink-0'
                />
                <div className='w-full flex flex-col leading-[1.25]'>
                    <span className='text-sm font-bold'>${athlete.fanTokenSymbol}</span>
                    <span className='text-[#969494] text-sm'>{athlete.sport}</span>
                </div>
            </button>
        </>
    );
};

export default AthleteCardButton;
