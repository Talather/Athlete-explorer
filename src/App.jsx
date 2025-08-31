import { Routes, Route } from 'react-router-dom'
import { ThirdwebProvider, useActiveWallet } from "thirdweb/react"
import { Provider } from 'react-redux'
import store from './store/index'
import Home from './pages/home'
import Durhino from './pages/Durhino'
import Settings from './pages/Settings'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Profile from './pages/Profile'
import ComingSoon from './pages/ComingSoon'
import CookiesModal from './components/CookiesModal'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './index.css'
import { useWeglot } from 'react-weglot';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLanguage, setCurrency, updateUserSettings, fetchUserSettings, fetchExchangeRates } from './store/slices/settingsSlice'
import {  fetchUserSubscriptions } from './store/slices/subscriptionSlice'
import { client } from './client';
import { useProfiles } from 'thirdweb/react';
import { fetchUserProfile } from './store/slices/userSlice'

// Protected Routes Component
function ProtectedRoutes() {
  const wallet = useActiveWallet();
  const dispatch = useDispatch();
  const { data: profiles } = useProfiles({ client });

  // Get user ID from wallet
  const userId = profiles?.[0]?.details?.id;

  // Fetch global data when wallet connects or app loads
  useEffect(() => {
    dispatch(fetchExchangeRates());
  }, [dispatch]);
 

  // Fetch user-specific data when wallet connects
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
      dispatch(fetchUserSettings(userId));
      dispatch(fetchUserSubscriptions(userId));
    }
  }, [userId, dispatch]);
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by this browser.'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            resolve({ lat, lng });
          },
          (error) => {
            reject(new Error('Failed to get location: ' + error.message));
          }
        );
      }
    });
  };

  const getCountryCodeFromLatLng = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      console.log(data , lat,lng);
      const countryCode = data?.address?.country_code?.toUpperCase(); // e.g. "PK", "US"
      return countryCode || null;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  };
  const detectLocationDefaults = async () => {
    try {
      const { lat, lng } = await getUserLocation(); // from previous step
      const countryCode = await getCountryCodeFromLatLng(lat, lng);
  
      console.log('Detected country:', countryCode);
  
      let language = 'en';
      let currency = 'USD';
  
      switch (countryCode) {
        case 'TR': language = 'tr'; currency = 'TRY'; break;
        case 'GB': language = 'en'; currency = 'GBP'; break;
        case 'US': language = 'en'; currency = 'USD'; break;
        case 'DE': case 'FR': case 'IT': case 'ES': case 'NL':
        case 'BE': case 'AT': case 'PT': case 'IE': case 'FI':
        case 'LU': case 'SI': case 'SK': case 'EE': case 'LV':
        case 'LT': case 'CY': case 'MT': case 'GR':
          language = 'en'; currency = 'EUR'; break;
        case 'BR': language = 'pt'; currency = 'BRL'; break;
        case 'KR': language = 'ko'; currency = 'KRW'; break;
        case 'JP': language = 'ja'; currency = 'JPY'; break;
      }
  
      return { language, currency, country: countryCode };
    } catch (err) {
      console.error('Location detection failed:', err);
      return { language: 'en', currency: 'USD', country: null };
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const { language, currency, country } = await detectLocationDefaults();
        console.log('Detected:', { language, currency, country });
        
        // Get previously stored location data from localStorage
        const storedLocationData = localStorage.getItem('userLocationData');
        const previousData = storedLocationData ? JSON.parse(storedLocationData) : null;
        
        console.log('Previous data:', previousData);
        
        // Check if location has changed or if it's the first time
        const hasLocationChanged = !previousData || 
          previousData.language !== language || 
          previousData.currency !== currency ||
          previousData.country !== country;
        
        if (hasLocationChanged) {
          console.log('Location changed, updating settings...');
          
          // Store new location data in localStorage
          const newLocationData = { language, currency, country, timestamp: Date.now() };
          localStorage.setItem('userLocationData', JSON.stringify(newLocationData));
          
          // Dispatch changes to Redux
          dispatch(setLanguage(language));
          dispatch(setCurrency(currency));
        } else {
          console.log('Location unchanged, skipping update');
        }
      } catch (error) {
        console.error('Location detection failed:', error);
      }
    })();
  }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/page' element={<Durhino />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
      <CookiesModal />
    </>
  );
}

// Main App Routes Component with Authentication
function AppRoutes() {
  // const { isAuthenticated, isLoading, login } = useAuth();

  // const handlePasswordSuccess = () => {
  //   login();
  // };

  // if (isLoading) {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-gradient-to-r from-[#f8e3e0] to-[#e9d5f7]">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return <ComingSoon onPasswordSuccess={handlePasswordSuccess} />;
  // }

  return <ProtectedRoutes />;
}

function App () {
  const [lang, setLang] = useWeglot('wg_67a51291b7ddd7a6965fae7d503730df2', 'es');

  return (
    <Provider store={store}>
      <ThirdwebProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThirdwebProvider>
    </Provider>
  )
}

export default App;
