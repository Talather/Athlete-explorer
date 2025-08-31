import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useProfiles } from "thirdweb/react";
import { client } from '../client';

import { 
  fetchUserSettings, 
  updateUserSettings,
  setLanguage,
  setCurrency,
  setNotificationEmail,
  setNotificationSms,
  setNotificationBrowser,
  clearError
} from '../store/slices/settingsSlice';

import { 
  updateUserProfile,
  uploadProfilePicture,
  createUserProfile,
  clearError as clearUserError,
  updateUsername
} from '../store/slices/userSlice';

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
    exchangeRatesLoading,
    notifications_email,
    notifications_sms,
    notifications_browser,
    browserNotificationPermission
  } = useSelector(state => state.settings);

  const {
    profile,
    loading: userLoading,
    error: userError,
    uploadingPicture,
    uploadError
  } = useSelector(state => state.user);

  const [profileImage, setProfileImage] = useState(profile?.profilePicture);
  const [username, setUsername] = useState(profile?.username || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  

  // Update local state when profile data changes
  useEffect(() => {
    if (profile) {
      setProfileImage(profile.profilePicture);
      setUsername(profile.username || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  // Update Weglot language when language changes
  useEffect(() => {
    if (window.Weglot && language) {
      window.Weglot.switchTo(language);
    }
  }, [language]);

  // Check browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      // dispatch(setBrowserNotificationPermission(Notification.permission));
    }
  }, [dispatch]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!userId) {
        toast.error('Please log in or signup to continue');
        return;
      }

      // Show preview immediately
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      try {
        await dispatch(uploadProfilePicture({ userId, file })).unwrap();
        toast.success('Profile picture updated successfully!');
      } catch (error) {
        toast.error(error || 'Failed to upload profile picture');
        // Revert to original image on error
        setProfileImage(profile?.profilePicture || '/sixer.gif');
      }
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    dispatch(updateUsername(e.target.value));
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      toast.error('Please log in or signup to continue');
      return;
    }

    try {
      await dispatch(updateUserProfile({
        userId,
        profileData: { username }
      })).unwrap();
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleSaveSettings = async () => {
    if (!userId) {
      toast.error('Please log in or signup to continue');
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

  const handleSaveNotifications = async () => {
    if (!userId) {
      toast.error('Please log in or signup to continue');
      return;
    }

    try {
      await dispatch(updateUserSettings({
        userId,
        settings: {
          notifications_email,
          notifications_sms,
          notifications_browser,
        }
      })).unwrap();
      
      toast.success('Notification preferences saved successfully!');
    } catch (error) {
      toast.error(error || 'Failed to save notification preferences');
    }
  };

  const handleRequestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        // dispatch(setBrowserNotificationPermission(permission));
        
        if (permission === 'granted') {
          toast.success('Browser notifications enabled!');
          dispatch(setNotificationBrowser(true));
        } else if (permission === 'denied') {
          toast.error('Browser notifications denied. You can enable them in your browser settings.');
          dispatch(setNotificationBrowser(false));
        }
      } catch (error) {
        toast.error('Error requesting notification permission');
      }
    } else {
      toast.error('Browser notifications not supported');
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
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
            <div className="flex flex-wrap items-center justify-center space-x-4 sm:space-x-8">
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
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative group shrink-0">
                    {profileImage? 
                  (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ):(
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg">
                      {/* <User size={90}/> */}
                    </div>
                  )}
                  {
                   !profileImage && (
                     <label className={`absolute inset-0 bg-black/50 rounded-full opacity-0 opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity ${uploadingPicture ? 'opacity-100' : ''}`}>
                        <Camera size={20} />
                    </label>
                   )

                  }
                   
                    <label className={`absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity ${uploadingPicture ? 'opacity-100' : ''}`}>
                      {uploadingPicture ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Camera size={20} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploadingPicture}
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
                          onChange={handleUsernameChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9352ee] focus:border-transparent outline-none transition-all"
                          placeholder="Enter your username"
                          disabled={userLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed outline-none"
                          placeholder="Email not set"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          To change your email, go to <span className="font-medium">Wallet → Manage Wallet → Linked Profiles</span>
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Phone</label>
                        <input
                          type="tel"
                          value={phone}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed outline-none"
                          placeholder="Phone not set"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          To change your phone number, go to <span className="font-medium">Wallet → Manage Wallet → Linked Profiles</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handleSaveProfile}
                          disabled={userLoading}
                          className="px-6 py-3 bg-gradient-to-r from-[#e99289] to-[#9352ee] text-white rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {userLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                          <span>Save Profile</span>
                        </button>
                      </div>

                      {userError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                          <AlertCircle size={16} />
                          <span className="text-sm">{userError}</span>
                        </div>
                      )}

                      {uploadError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                          <AlertCircle size={16} />
                          <span className="text-sm">{uploadError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Email Notifications */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-3">
                      <Mail className="inline mr-2" size={16} />
                      Email Notifications
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications_email}
                        onChange={(e) => dispatch(setNotificationEmail(e.target.checked))}
                        className="w-4 h-4 text-[#9352ee] bg-gray-100 rounded border-gray-300 focus:ring-[#9352ee] focus:ring-2"
                      />
                      <span className="text-sm">Receive email notifications</span>
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-3">
                      <Phone className="inline mr-2" size={16} />
                      SMS Notifications
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications_sms}
                        onChange={(e) => dispatch(setNotificationSms(e.target.checked))}
                        className="w-4 h-4 text-[#9352ee] bg-gray-100 rounded border-gray-300 focus:ring-[#9352ee] focus:ring-2"
                      />
                      <span className="text-sm">Receive SMS notifications</span>
                    </div>
                  </div>

                  {/* Browser Notifications */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-3">
                      <Bell className="inline mr-2" size={16} />
                      Browser Notifications
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications_browser}
                        onChange={(e) => dispatch(setNotificationBrowser(e.target.checked))}
                        className="w-4 h-4 text-[#9352ee] bg-gray-100 rounded border-gray-300 focus:ring-[#9352ee] focus:ring-2"
                      />
                      <span className="text-sm">Receive browser notifications</span>
                      {browserNotificationPermission === 'denied' && (
                        <span className="text-xs text-red-500">Browser notifications are blocked. Please enable them in your browser settings.</span>
                      )}
                      {/* {browserNotificationPermission === 'default' && (
                        <button
                          onClick={handleRequestNotificationPermission}
                          className="ml-2 text-sm text-[#9352ee] hover:text-[#1D1D1D]"
                        >
                          Request permission
                        </button>
                      )} */}
                    </div>
                  </div>

               
                

               

               

               

                </div>

                {/* Save Button */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveNotifications}
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
              </div>
            )}

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
