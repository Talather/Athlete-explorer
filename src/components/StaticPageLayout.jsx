import React from 'react';
import Navbar from './Navbar';
import { useStaticPages } from '../hooks/useStaticPages';

const StaticPageLayout = ({ pageType, title, icon }) => {
  const { content, loading, error } = useStaticPages(pageType);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7]">
          <div className="text-center">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-16 h-16 border-4 border-t-[#9352ee] border-r-[#e99289] border-b-[#9352ee] border-l-[#e99289] rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-[#1D1D1D] mb-2">Loading {title}</h2>
              <p className="text-[#717071]">Please wait while we fetch the content...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7]">
          <div className="text-center">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-[#9352ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-2xl font-bold text-[#1D1D1D] mb-2">Content Not Available</h2>
              <p className="text-[#717071] mb-4">Sorry, we couldn't load the {title.toLowerCase()} content. Please try again later.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const renderContent = (contentData) => {
    if (!contentData) return null;

    // If content is a JSON object with sections
    if (typeof contentData === 'object' && contentData.sections) {
      return contentData.sections.map((section, index) => (
        <div key={index} className="mb-8">
          {section.title && (
            <h2 className="text-2xl font-bold text-[#1D1D1D] mb-4">{section.title}</h2>
          )}
          {section.content && (
            <div className="text-[#717071] leading-relaxed space-y-4">
              {Array.isArray(section.content) ? (
                section.content.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          )}
          {section.items && (
            <ul className="list-disc list-inside text-[#717071] space-y-2 mt-4">
              {section.items.map((item, iIndex) => (
                <li key={iIndex}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ));
    }

    // If content is a simple string or HTML
    if (typeof contentData === 'string') {
      return (
        <div className="text-[#717071] leading-relaxed" dangerouslySetInnerHTML={{ __html: contentData }} />
      );
    }

    // Default fallback
    return (
      <div className="text-[#717071] leading-relaxed">
        <pre>{JSON.stringify(contentData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white flex items-center justify-center py-3 sm:py-4 text-[24px] sm:text-[2.5vw] leading-normal font-semibold">
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <h1>{title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {content && renderContent(content.content)}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticPageLayout;
