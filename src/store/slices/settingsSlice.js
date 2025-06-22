import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

// Async thunk to fetch user settings
export const fetchUserSettings = createAsyncThunk(
  'settings/fetchUserSettings',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('language, currency, email, phone')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update user settings
export const updateUserSettings = createAsyncThunk(
  'settings/updateUserSettings',
  async ({ userId, settings }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(settings)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch exchange rates
export const fetchExchangeRates = createAsyncThunk(
  'settings/fetchExchangeRates',
  async (baseCurrency = 'EUR', { rejectWithValue }) => {
    try {
      const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`);
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      const data = await response.json();
      console.log(data);
      return { base: baseCurrency, rates: data.rates, date: data.date };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings', 
  initialState: {
    // User settings
    language: 'en',
    currency: 'EUR',
    email: '',
    phone: '',
    // Exchange rates
    exchangeRates: null,
    baseCurrency: 'EUR',
    // Loading states
    loading: false,
    exchangeRatesLoading: false,
    // Error states
    error: null,
    exchangeRatesError: null,
  },
  reducers: {
    // Local settings updates (before API call)
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setNotificationEmail: (state, action) => {
      state.notifications_email = action.payload;
    },
    setNotificationSms: (state, action) => {
      state.notifications_sms = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.exchangeRatesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user settings
      .addCase(fetchUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.language = action.payload.language || 'en';
          state.currency = action.payload.currency || 'EUR';
          state.email = action.payload.email || '';
          state.phone = action.payload.phone || '';
        }
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user settings
      .addCase(updateUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.language = action.payload.language || state.language;
          state.currency = action.payload.currency || state.currency;
          state.email = action.payload.email || state.email;
          state.phone = action.payload.phone || state.phone;
        }
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch exchange rates
      .addCase(fetchExchangeRates.pending, (state) => {
        state.exchangeRatesLoading = true;
        state.exchangeRatesError = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.exchangeRatesLoading = false;
        state.exchangeRates = action.payload;
        state.baseCurrency = action.payload.base;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.exchangeRatesLoading = false;
        state.exchangeRatesError = action.payload;
      });
  },
});

export const {
  setLanguage,
  setCurrency,
  setEmail,
  setPhone,
  clearError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
