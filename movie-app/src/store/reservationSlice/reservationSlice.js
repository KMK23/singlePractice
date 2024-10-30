// src/features/reservation/reservationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMovie: null,
  selectedRegion: null,
  selectedTheater: null,
  selectedDate: "",
  selectedTime: null,
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    selectMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    selectRegion: (state, action) => {
      state.selectedRegion = action.payload;
      state.selectedTheater = null; // 새로운 지역을 선택하면 극장 초기화
    },
    selectTheater: (state, action) => {
      state.selectedTheater = action.payload;
    },
    selectDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    selectTime: (state, action) => {
      state.selectedTime = action.payload;
    },
  },
});

export const {
  selectMovie,
  selectRegion,
  selectTheater,
  selectDate,
  selectTime,
} = reservationSlice.actions;

export default reservationSlice.reducer;
