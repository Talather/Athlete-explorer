import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

// Async thunk to fetch subscriptions for a specific user
export const fetchUserSubscriptions = createAsyncThunk(
  'subscriptions/fetchUserSubscriptions',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("userId", userId)
        .order("created_at", { ascending: false });
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userSubscriptions: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearUserSubscriptions: (state) => {
      state.userSubscriptions = [];
      state.error = null;
    },
    addSubscription: (state, action) => {
      state.userSubscriptions.unshift(action.payload);
    },
    removeSubscription: (state, action) => {
      const subscriptionId = action.payload;
      state.userSubscriptions = state.userSubscriptions.filter(sub => sub.id !== subscriptionId);
    },
    updateSubscription: (state, action) => {
      const updatedSubscription = action.payload;
      const userIndex = state.userSubscriptions.findIndex(sub => sub.id === updatedSubscription.id);
      if (userIndex !== -1) {
        state.userSubscriptions[userIndex] = updatedSubscription;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user subscriptions
      .addCase(fetchUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.userSubscriptions = action.payload;
        state.error = null;
      })
      .addCase(fetchUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearUserSubscriptions, 
  addSubscription, 
  removeSubscription, 
  updateSubscription 
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
