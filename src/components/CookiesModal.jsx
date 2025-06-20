import React, { useState, useEffect } from 'react';
import { useStaticPages } from '../hooks/useStaticPages';

const CookiesModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { content, loading, error } = useStaticPages('cookies');
  useEffect(() => {
    // Check if user has already seen the cookies modal
    const cookiesAccepted = localStorage.getItem('fansday-cookies-accepted');
    if (!cookiesAccepted) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('fansday-cookies-accepted', 'all');
    localStorage.setItem('fansday-cookies-timestamp', new Date().toISOString());
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('fansday-cookies-accepted', 'essential');
    localStorage.setItem('fansday-cookies-timestamp', new Date().toISOString());
    setIsVisible(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white p-6 rounded-t-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍪</span>
            <h2 className="text-2xl font-bold">Cookie Preferences</h2>
          </div>
          <p className="text-white/90 mt-2">
            We use cookies to enhance your experience on Fansday
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-t-[#9352ee] border-r-[#e99289] border-b-[#9352ee] border-l-[#e99289] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#717071]">Loading cookie information...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-[#717071]">
                We use cookies to improve your experience. By continuing to use our site, you agree to our use of cookies.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[#717071] leading-relaxed mb-4">
                We use cookies and similar technologies to provide you with a personalized experience, 
                analyze website usage, and assist with our marketing efforts.
              </p>

              {/* Cookie Types Summary */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#f8e3e0] p-4 rounded-lg border-l-4 border-[#e99289]">
                  <h4 className="font-semibold text-[#1D1D1D] mb-2">Essential Cookies</h4>
                  <p className="text-[#717071] text-sm">
                    Required for the website to function properly and cannot be disabled.
                  </p>
                </div>
                <div className="bg-[#e9d5f7] p-4 rounded-lg border-l-4 border-[#9352ee]">
                  <h4 className="font-semibold text-[#1D1D1D] mb-2">Optional Cookies</h4>
                  <p className="text-[#717071] text-sm">
                    Help us analyze usage and provide personalized content and ads.
                  </p>
                </div>
              </div>

              {/* Show Details Toggle */}
              <button
                onClick={toggleDetails}
                className="text-[#9352ee] hover:text-[#e99289] font-medium mb-4 flex items-center gap-2 transition-colors"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
                <svg 
                  className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Detailed Information */}
              {showDetails && content?.content?.sections && (
                <div className="bg-[#f8f9fa] rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-[#1D1D1D] mb-3">Cookie Details</h4>
                  {content.content.sections.map((section, index) => (
                    <div key={index} className="mb-4">
                      <h5 className="font-medium text-[#1D1D1D] mb-2">{section.title}</h5>
                      {section.content && (
                        <div className="space-y-2">
                            {section.content}
                          {/* {section.content.map((paragraph, pIndex) => (
                            <p key={pIndex} className="text-[#717071] text-sm leading-relaxed">
                              {paragraph}
                            </p>
                          ))} */}
                        </div>
                      )}
                      {section.items && (
                        <ul className="list-disc list-inside text-[#717071] text-sm space-y-1 ml-2">
                          {section.items.map((item, iIndex) => (
                            <li key={iIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleAcceptEssential}
              className="flex-1 bg-white border-2 border-[#9352ee] text-[#9352ee] font-semibold py-3 px-6 rounded-full hover:bg-[#9352ee] hover:text-white transition-all duration-200"
            >
              Accept Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white font-semibold py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
            >
              Accept All Cookies
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <a 
              href="/terms" 
              className="text-[#717071] hover:text-[#9352ee] text-sm transition-colors"
            >
              Terms and Conditions
            </a>
            <a 
              href="/privacy" 
              className="text-[#717071] hover:text-[#9352ee] text-sm transition-colors"
            >
              Privacy Policy
            </a>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesModal;
