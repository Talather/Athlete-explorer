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

  
  async function detectLocationDefaults() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
  
      const res = await fetch("https://get.geojs.io/v1/ip/geo.json", { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`GeoJS HTTP ${res.status}`);
  
      const data = await res.json();
      const cc = String(data.country_code || data.country || "").toUpperCase();
      console.log("this is real", cc);
      let language = "en";
      let currency = "USD";
  
      switch (cc) {
        case "TR": // Turkey
          language = "tr"; currency = "TRY"; break;
        case "GB": // United Kingdom
          language = "en"; currency = "GBP"; break;
        case "US": // United States
          language = "en"; currency = "USD"; break;
  
        // European Union countries (exactly as in your code)
        case "DE": case "FR": case "IT": case "ES": case "NL":
        case "BE": case "AT": case "PT": case "IE": case "FI":
        case "LU": case "SI": case "SK": case "EE": case "LV":
        case "LT": case "CY": case "MT": case "GR":
          language = "en"; currency = "EUR"; break;
  
        case "BR": // Brazil
          language = "pt"; currency = "BRL"; break;
        case "KR": // South Korea
          language = "ko"; currency = "KRW"; break;
        case "JP": // Japan
          language = "ja"; currency = "JPY"; break;
  
        default:
          language = "en"; currency = "USD";
      }
  
      return { language, currency, country: cc || null };
    } catch {
      // Fallback to defaults
      return { language: "en", currency: "USD", country: null };
    }
  }
  
  useEffect(() => {
    (async () => {
      try {
        const { language, currency, country } = await detectLocationDefaults();
        console.log(language,currency,country);
        
        // Get previously stored location data from localStorage
        const storedLocationData = localStorage.getItem('userLocationData');
        const previousData = storedLocationData ? JSON.parse(storedLocationData) : null;
        
        
        
          
          // Store new location data in localStorage
          const newLocationData = { language, currency, country, timestamp: Date.now() };
          localStorage.setItem('userLocationData', JSON.stringify(newLocationData));
          
          // Dispatch changes to Redux
          dispatch(setLanguage(language));
          dispatch(setCurrency(currency));
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
