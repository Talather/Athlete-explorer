import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

// Async thunk to fetch user profile data
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, phone, profilePicture, language, currency, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...profileData,
        })
        .eq('id', userId)
        .select()
        .single();
         console.log(data);
      if (error) {
        throw error;
      }
  
      if (profileData.username) {
        // Don't await this - let it run in background
       const{data,error} = await supabase
          .from('messages')
          .update({ username: profileData.username })
          .eq('user_id', userId)
          console.log(data,error);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to upload profile picture
export const uploadProfilePicture = createAsyncThunk(
  'user/uploadProfilePicture',
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('athletes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('athletes')
        .getPublicUrl(filePath);

      const profilePictureUrl = urlData.publicUrl;

      // Update user record with new profile picture URL
      const { data, error } = await supabase
        .from('users')
        .update({ 
          profilePicture: profilePictureUrl,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update messages table with new profile picture asynchronously
      // Don't await this - let it run in background
      supabase
        .from('messages')
        .update({ profilePicture: profilePictureUrl })
        .eq('user_id', userId)
        .then(({ error: messageError }) => {
          if (messageError) {
            console.error('Error updating messages profile picture:', messageError);
          } else {
            console.log('Messages profile picture updated successfully');
          }
        });

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create user if not exists
export const createUserProfile = createAsyncThunk(
  'user/createUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          username: '',
          profilePicture: null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    uploadingPicture: false,
    uploadError: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.uploadError = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.uploadError = null;
    },
    updateUsername: (state, action) => {
      if (state.profile) {
        state.profile.username = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload profile picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploadingPicture = true;
        state.uploadError = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.uploadingPicture = false;
        state.profile = action.payload;
        state.uploadError = null;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploadingPicture = false;
        state.uploadError = action.payload;
      })
      
      // Create user profile
      .addCase(createUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearProfile, updateUsername } = userSlice.actions;
export default userSlice.reducer;
