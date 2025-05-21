import { configureStore } from '@reduxjs/toolkit';
import athleteReducer from './slices/athleteSlice';

const store = configureStore({
  reducer: {
    athletes: athleteReducer,
    // Add other reducers here as your app grows
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
