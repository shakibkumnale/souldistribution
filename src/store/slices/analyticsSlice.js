import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching analytics data
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (artistId = '', { rejectWithValue }) => {
    try {
      // Build URL with potential artist filter
      const url = artistId 
        ? `/api/analytics?artist=${artistId}` 
        : '/api/analytics';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  analyticsData: [],
  recentReports: [],
  currentArtist: null,
  artists: [],
  loading: false,
  isFiltering: false,
  error: null,
  lastFetched: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setArtistFilter: (state, action) => {
      state.artistFilter = action.payload;
    },
    clearAnalyticsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Set isFiltering based on whether we're filtering by artist
        state.isFiltering = !!action.meta.arg;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload.analytics || [];
        state.recentReports = action.payload.recentReports || [];
        state.currentArtist = action.payload.currentArtist || null;
        
        // Only set artists list if we're not filtering
        if (action.payload.artists) {
          state.artists = action.payload.artists;
        }
        
        state.isFiltering = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFiltering = false;
      });
  }
});

export const { setArtistFilter, clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 