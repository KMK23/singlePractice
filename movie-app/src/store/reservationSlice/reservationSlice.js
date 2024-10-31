// src/features/reservation/reservationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMovie: null, // 선택한 영화
  selectedRegion: null, // 선택한 지역
  selectedTheater: null, // 선택한 극장
  selectedDate: "", // 선택한 날짜
  selectedTime: null, // 선택한 시간
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    // 영화 선택 액션
    selectMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    // 지역 선택 액션
    selectRegion: (state, action) => {
      state.selectedRegion = action.payload;
      state.selectedTheater = null; // 새로운 지역 선택 시 극장 초기화
    },
    // 극장 선택 액션
    selectTheater: (state, action) => {
      state.selectedTheater = action.payload;
    },
    // 날짜 선택 액션
    selectDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    // 시간 선택 액션
    selectTime: (state, action) => {
      state.selectedTime = action.payload;
    },
    // 전체 예약 상태 초기화
    resetReservation: () => initialState,
  },
});

// 액션 생성자와 리듀서 export
export const {
  selectMovie,
  selectRegion,
  selectTheater,
  selectDate,
  selectTime,
  resetReservation,
} = reservationSlice.actions;

export default reservationSlice.reducer;
