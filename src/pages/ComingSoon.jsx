import { useState } from 'react';
import { toast } from 'react-hot-toast';

const ComingSoon = ({ onPasswordSuccess }) => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (password === 'open25.') {
            localStorage.setItem('fansday_authenticated', 'true');
            toast.success('Access granted! Welcome to Fansday!');
            onPasswordSuccess();
        } else {
            toast.error('Incorrect password. Please try again.');
            setPassword('');
        }
        
        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

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
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h2>
                        <p className="text-gray-600">Enter the password to access Fansday</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className="w-full px-5 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !password.trim()}
                            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold rounded-xl shadow-md hover:scale-[1.02] transition-transform overflow-hidden p-px disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <span className='bg-white inline-block w-full px-5 py-3 rounded-xl'>
                                {isLoading ? 'Checking...' : 'Submit'}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
