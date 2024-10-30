import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/now_playing?language=ko&page=1&region=KR",
    {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWU2Mjc5NzgxZDBjNjcxOTY0MTU3OGNmYmU1Njk2OCIsIm5iZiI6MTczMDA5MDg3Ny45NDA1NTgsInN1YiI6IjY3MWI2NTM4MzRjMGZhYmQ2ODFjN2M2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dPWaHht1w0mkS5At-coEotUeFQPp3tP2zo0_TyNC5Fg",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  const data = await response.json();
  return data.results; // 결과를 반환합니다.
});

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload; // 받아온 데이터를 저장합니다.
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // 오류 처리
      });
  },
});

export const selectMovies = (state) => state.movies.movies;
export const selectLoading = (state) => state.movies.loading;
export const selectError = (state) => state.movies.error;

export default movieSlice.reducer;
