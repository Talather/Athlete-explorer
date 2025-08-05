import { useState } from 'react';

const ComingSoon = () => {
    const [password, setPassword] = useState('');

    return (
        <div className='h-[100dvh] relative bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7]'>
            {/* Top logo bar */}
            <div className="px-4 py-[10px] bg-white shadow-md flex items-center justify-center">
                <div className="inline-block">
                    <img sizes="auto" alt="Logo" className="size-[60px] object-cover
                        sm:size-[80px] sm:px-[10px] sm:py-[7.5px]" src="/sixer.gif" />
                </div>
            </div>

            {/* Main content */}
            <div className="h-[calc(100dvh-145px)] min-[382px]:h-[calc(100dvh-175px)] sm:h-[calc(100dvh-196px)]">
                
                <div className="w-full text-center primary-gradient px-5 text-white py-3 sm:py-4 text-[24px] sm:text-[2.5vw] leading-normal font-semibold">
                    COMING SOON
                </div>

                {/* Password Input */}
                <div className="w-[95%] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-6 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center h-[calc(100%-35px)]">
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="max-w-sm mx-auto w-full px-5 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    />
                    <button
                        className="w-full max-w-sm mx-auto mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold rounded-xl shadow-md hover:scale-[1.02] transition-transform overflow-hidden p-px"
                    >
                        <span className='bg-white inline-block w-full px-5 py-3 rounded-xl'>
                            Submit
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
