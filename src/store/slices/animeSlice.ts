import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Anime } from '../../types/anime';
import { searchAnime, getAnimeDetail, getTopAnime } from '../../services/api';

interface PaginationInfo {
  currentPage: number;
  lastVisiblePage: number;
  hasNextPage: boolean;
  itemsPerPage: number;
  totalItems: number;
  currentPageItems: number;
}

interface AnimeState {
  searchResults: Anime[];
  selectedAnime: Anime | null;
  recommendations: Anime[];
  loading: boolean;
  recommendationsLoading: boolean;
  error: string | null;
  searchQuery: string;
  pagination: PaginationInfo | null;
}

const initialState: AnimeState = {
  searchResults: [],
  selectedAnime: null,
  recommendations: [],
  loading: false,
  recommendationsLoading: false,
  error: null,
  searchQuery: '',
  pagination: null,
};

export interface SearchParams {
  query: string;
  limit?: number;
  page?: number;
}

export interface TopAnimeParams {
  limit?: number;
  page?: number;
}

export const fetchAnimeSearch = createAsyncThunk<
  { results: Anime[]; query: string; pagination: PaginationInfo },
  SearchParams,
  { rejectValue: string }
>(
  'anime/search',
  async ({ query, limit, page }, { rejectWithValue, signal }) => {
    try {
      const response = await searchAnime({ query, limit, page, signal });
      const pagination: PaginationInfo = {
        currentPage: response.pagination.current_page,
        lastVisiblePage: response.pagination.last_visible_page,
        hasNextPage: response.pagination.has_next_page,
        itemsPerPage: response.pagination.items.per_page,
        totalItems: response.pagination.items.total,
        currentPageItems: response.pagination.items.count,
      };
      return { results: response.data, query, pagination };
    } catch (error) {
      // Don't show error if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return rejectWithValue('');
      }
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to search anime'
      );
    }
  }
);

export const fetchAnimeDetail = createAsyncThunk<
  Anime,
  number,
  { rejectValue: string }
>(
  'anime/detail',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getAnimeDetail(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch anime details'
      );
    }
  }
);

export const fetchTopAnimeForFiltering = createAsyncThunk<
  { results: Anime[]; query: string; pagination: PaginationInfo },
  TopAnimeParams,
  { rejectValue: string }
>(
  'anime/topForFiltering',
  async ({ limit = 25, page = 1 }, { rejectWithValue, signal }) => {
    try {
      const response = await getTopAnime(limit, page, signal);
      const pagination: PaginationInfo = {
        currentPage: response.pagination.current_page,
        lastVisiblePage: response.pagination.last_visible_page,
        hasNextPage: response.pagination.has_next_page,
        itemsPerPage: response.pagination.items.per_page,
        totalItems: response.pagination.items.total,
        currentPageItems: response.pagination.items.count,
      };
      return { results: response.data, query: '', pagination };
    } catch (error) {
      // Don't show error if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return rejectWithValue('');
      }
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch top anime'
      );
    }
  }
);

export const fetchRecommendations = createAsyncThunk<
  Anime[],
  { limit?: number },
  { rejectValue: string }
>(
  'anime/recommendations',
  async ({ limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getTopAnime(limit, 1);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch recommendations'
      );
    }
  }
);

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    clearSearchResults: (state: AnimeState) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.pagination = null;
    },
    clearSelectedAnime: (state: AnimeState) => {
      state.selectedAnime = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(fetchAnimeSearch.pending, (state: AnimeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeSearch.fulfilled, (state: AnimeState, action: PayloadAction<{ results: Anime[]; query: string; pagination: PaginationInfo }>) => {
        state.loading = false;
        state.searchResults = action.payload.results;
        state.searchQuery = action.payload.query;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAnimeSearch.rejected, (state: AnimeState, action) => {
        // Only update state if not aborted (empty payload means aborted)
        if (action.payload !== '') {
          state.loading = false;
          state.error = action.payload || 'Failed to search anime';
          state.searchResults = [];
          state.pagination = null;
        }
        // If aborted, don't update state - let the new request handle it
      })
      // Top Anime for Filtering
      .addCase(fetchTopAnimeForFiltering.pending, (state: AnimeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopAnimeForFiltering.fulfilled, (state: AnimeState, action: PayloadAction<{ results: Anime[]; query: string; pagination: PaginationInfo }>) => {
        state.loading = false;
        state.searchResults = action.payload.results;
        state.searchQuery = action.payload.query;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTopAnimeForFiltering.rejected, (state: AnimeState, action) => {
        // Only update state if not aborted (empty payload means aborted)
        if (action.payload !== '') {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch top anime';
          state.searchResults = [];
          state.pagination = null;
        }
        // If aborted, don't update state - let the new request handle it
      })
      // Detail
      .addCase(fetchAnimeDetail.pending, (state: AnimeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeDetail.fulfilled, (state: AnimeState, action: PayloadAction<Anime>) => {
        state.loading = false;
        state.selectedAnime = action.payload;
      })
      .addCase(fetchAnimeDetail.rejected, (state: AnimeState, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch anime details';
        state.selectedAnime = null;
      })
      // Recommendations
      .addCase(fetchRecommendations.pending, (state: AnimeState) => {
        state.recommendationsLoading = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state: AnimeState, action: PayloadAction<Anime[]>) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state: AnimeState) => {
        state.recommendationsLoading = false;
        // Don't set error for recommendations to avoid disrupting main search
      });
  },
});

export const { clearSearchResults, clearSelectedAnime } = animeSlice.actions;
export default animeSlice.reducer;

