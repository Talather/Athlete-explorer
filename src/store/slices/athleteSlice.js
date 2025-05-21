import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

// Async thunk to fetch athletes
export const fetchAthletes = createAsyncThunk(
  'athletes/fetchAthletes',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("Atheletes")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch events for a specific athlete
export const fetchAthleteEvents = createAsyncThunk(
  'athletes/fetchAthleteEvents',
  async (athlete, { rejectWithValue }) => {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from("Events")
        .select("*")
        .eq("athelete_token_id", athlete.id)
        .lte("day", formattedDate)
        .order("day", { ascending: false });

      if (error) {
        return rejectWithValue(error.message);
      }

      return { 
        athleteId: athlete.id, 
        events: data || [],
        athlete: {
          ...athlete,
          video_url: "https://nargvalmcrunehnemvpa.supabase.co/storage/v1/object/sign/Athlete/Villain%20LeBron%20did%20not%20forget.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdGhsZXRlL1ZpbGxhaW4gTGVCcm9uIGRpZCBub3QgZm9yZ2V0Lm1wNCIsImlhdCI6MTc0MTU5ODYyOCwiZXhwIjoxNzQ0MTkwNjI4fQ.LCNqKXp4xqfja0Ga7QdfeQ4Vk-ZEUjj5lq8tXSj5sqM"
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const athleteSlice = createSlice({
  name: 'athletes',
  initialState: {
    athletes: [],
    selectedAthlete: null,
    events: [],
    selectedEvent: null,
    isExpanded: false,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedAthlete: (state, action) => {
      state.selectedAthlete = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
      state.isExpanded = true;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.isExpanded = false;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAthletes
      .addCase(fetchAthletes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAthletes.fulfilled, (state, action) => {
        state.loading = false;
        state.athletes = action.payload;
      })
      .addCase(fetchAthletes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetchAthleteEvents
      .addCase(fetchAthleteEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAthleteEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAthlete = action.payload.athlete;
        state.events = action.payload.events;
      })
      .addCase(fetchAthleteEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedAthlete,setEvents, setSelectedEvent, clearSelectedEvent } = athleteSlice.actions;
export default athleteSlice.reducer;
