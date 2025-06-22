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
import CookiesModal from './components/CookiesModal'
import './index.css'
import { useWeglot } from 'react-weglot';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUserSettings, fetchExchangeRates } from './store/slices/settingsSlice'
import {  fetchUserSubscriptions } from './store/slices/subscriptionSlice'
import { client } from './client';
import { useProfiles } from 'thirdweb/react';
// Main App Routes Component
function AppRoutes() {
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
      dispatch(fetchUserSettings(userId));
      dispatch(fetchUserSubscriptions(userId));
    }
  }, [userId, dispatch]);

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

function App () {
  const [lang, setLang] = useWeglot('wg_67a51291b7ddd7a6965fae7d503730df2', 'es');

  return (
    <Provider store={store}>
      <ThirdwebProvider>
        <AppRoutes />
      </ThirdwebProvider>
    </Provider>
  )
}

export default App;
