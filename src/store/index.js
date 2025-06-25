import { configureStore } from '@reduxjs/toolkit';
import athleteReducer from './slices/athleteSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import settingsReducer from './slices/settingsSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    athletes: athleteReducer,
    subscriptions: subscriptionReducer,
    settings: settingsReducer,
    user: userReducer,
    // Add other reducers here as your app grows
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
