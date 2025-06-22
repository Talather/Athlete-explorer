import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useProfiles } from "thirdweb/react";
import { client } from '../client';

import { 
  fetchUserSettings, 
  updateUserSettings, 
  fetchExchangeRates,
  setLanguage,
  setCurrency,
  clearError
} from '../store/slices/settingsSlice';
import { supabase } from '../lib/supabase';
import { supportedCurrencies, supportedLanguages } from '../utils/currencyConverter';
import { 
  User, 
  Globe, 
  DollarSign, 
  Mail, 
  Phone, 
  Bell, 
  Save, 
  Trash2,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

function SettingsPage() {
  const dispatch = useDispatch();
  const { data: profiles } = useProfiles({ client });
  const userId = profiles?.[0]?.details?.id;
  
  const {
    language,
    currency,
    loading,
    error,
    exchangeRates,
    exchangeRatesLoading
  } = useSelector(state => state.settings);

  const [profileImage, setProfileImage] = useState("/sixer.gif");
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("preferences");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (userId) {
      // Data is now fetched globally in App.jsx, no need to fetch here
      // dispatch(fetchUserSettings(userId));
      // dispatch(fetchExchangeRates());
    }
  }, [userId, dispatch]);

  // Update Weglot language when language changes
  useEffect(() => {
    if (window.Weglot && language) {
      window.Weglot.switchTo(language);
    }
  }, [language]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSaveSettings = async () => {
    if (!userId) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await dispatch(updateUserSettings({
        userId,
        settings: {
          language,
          currency,
        }
      })).unwrap();
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error(error || 'Failed to save settings');
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Account deleted successfully');
      setShowDeleteConfirm(false);
      // You might want to redirect or logout here
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const tabs = [
      { id: 'preferences', label: 'Preferences', icon: Globe },
    // { id: 'profile', label: 'Profile', icon: User },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e3e0] to-[#e9d5f7] py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#1D1D1D] mb-2">Settings</h1>
          <p className="text-[#717071] text-sm sm:text-base">Customize your account preferences and settings</p>
        </div>

        {/* Main Settings Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-white/20">
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 px-4 sm:px-6">
            <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#9352ee] text-[#9352ee]'
                        : 'border-transparent text-[#717071] hover:text-[#1D1D1D]'
                    }`}
                  >
                    <IconComponent size={16} />
                    <span className="text-sm sm:text-base font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            
            {/* Profile Tab */}
            {/* {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative group shrink-0">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                      <Camera size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9352ee] focus:border-transparent outline-none transition-all"
                          placeholder="Enter your username"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => dispatch(setEmail(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9352ee] focus:border-transparent outline-none transition-all"
                            placeholder="you@example.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Phone</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => dispatch(setPhone(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9352ee] focus:border-transparent outline-none transition-all"
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-3">
                      <Globe className="inline mr-2" size={16} />
                      Language
                    </label>
                    <select 
                      value={language}
                      onChange={(e) => dispatch(setLanguage(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9352ee] focus:border-transparent outline-none transition-all"
                    >
                      {supportedLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Currency Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-3">
                      <DollarSign className="inline mr-2" size={16} />
                      Currency
                    </label>
                    <select 
                      value={currency}
                      onChange={(e) => dispatch(setCurrency(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9352ee] focus:border-transparent outline-none transition-all"
                    >
                      {supportedCurrencies.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.symbol} {curr.name} ({curr.code})
                        </option>
                      ))}
                    </select>
                    {exchangeRatesLoading && (
                      <p className="text-xs text-[#717071] mt-1 flex items-center">
                        <Loader2 size={12} className="animate-spin mr-1" />
                        Updating exchange rates...
                      </p>
                    )}
                  </div>
                </div>

                {/* Exchange Rate Info */}
                {/* {exchangeRates && (
                  <div className="bg-gradient-to-r from-[#e99289]/10 to-[#9352ee]/10 rounded-xl p-4">
                    <h3 className="font-semibold text-[#1D1D1D] mb-2 flex items-center">
                      <DollarSign size={16} className="mr-2" />
                      Current Exchange Rates
                    </h3>
                    <p className="text-sm text-[#717071]">
                      Base: {exchangeRates.base} | Last updated: {exchangeRates.date}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
                      {Object.entries(exchangeRates.rates).slice(0, 8).map(([curr, rate]) => (
                        <div key={curr} className="bg-white/50 rounded px-2 py-1">
                          <span className="font-medium">{curr}</span>: {rate.toFixed(4)}
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            )}

            {/* Notifications Tab */}
            {/* {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Mail size={20} className="text-[#9352ee]" />
                      <div>
                        <h3 className="font-semibold text-[#1D1D1D]">Email Notifications</h3>
                        <p className="text-xs text-[#717071]">Receive updates via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications_email}
                        onChange={(e) => dispatch(setNotificationEmail(e.target.checked))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9352ee]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9352ee]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Phone size={20} className="text-[#e99289]" />
                      <div>
                        <h3 className="font-semibold text-[#1D1D1D]">SMS Notifications</h3>
                        <p className="text-xs text-[#717071]">Receive updates via SMS</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications_sms}
                        onChange={(e) => dispatch(setNotificationSms(e.target.checked))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e99289]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e99289]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )} */}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-2">
                <AlertCircle size={20} className="text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
                <button 
                  onClick={() => dispatch(clearError())}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-red-200 pt-6 mt-8">
              <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                <AlertCircle size={20} className="mr-2" />
                Danger Zone
              </h3>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Delete Account</span>
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 mb-4">
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
