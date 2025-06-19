import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { insertSampleStaticPages } from '../utils/insertSampleStaticPages';

const AdminStaticPages = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleInsertSampleData = async () => {
    setLoading(true);
    try {
      const insertResults = await insertSampleStaticPages();
      setResults(insertResults);
    } catch (error) {
      console.error('Error inserting sample data:', error);
      setResults([{ pageType: 'error', success: false, error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white flex items-center justify-center py-3 sm:py-4 text-[24px] sm:text-[2.5vw] leading-normal font-semibold">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <h1>Static Pages Admin</h1>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1D1D1D] mb-6">Database Management</h2>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">Insert Sample Data</h3>
                <p className="text-[#717071] mb-4">
                  This will populate your static_pages table with sample content for FAQ, Terms & Conditions, Privacy Policy, and Cookies Policy.
                </p>
                
                <button
                  onClick={handleInsertSampleData}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#e99289] to-[#9352ee] hover:opacity-90 text-white'
                  }`}
                >
                  {loading ? 'Inserting...' : 'Insert Sample Data'}
                </button>
              </div>

              {results && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">Results</h3>
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span className="font-semibold">
                          {result.success ? '✅' : '❌'} {result.pageType}
                        </span>
                        {result.error && (
                          <p className="text-sm mt-1">{result.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">Page Links</h3>
                <p className="text-[#717071] mb-4">Test your static pages:</p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/faq"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    FAQ Page
                  </a>
                  <a
                    href="/terms"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Terms & Conditions
                  </a>
                  <a
                    href="/privacy"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="/cookies"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Cookies Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminStaticPages;
