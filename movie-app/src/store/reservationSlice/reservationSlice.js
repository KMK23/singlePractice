import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateDatas } from "../../firebase";

// 초기 상태
const initialState = {
  selectedMovie: null, // 선택한 영화
  selectedRegion: null, // 선택한 지역
  selectedTheater: null, // 선택한 극장
  selectedDate: "", // 선택한 날짜
  selectedTime: null, // 선택한 시간
  selectedSeats: [], // 선택한 좌석
  status: "idle", // 상태 관리 (idle, loading, succeeded, failed)
  error: null, // 오류 메시지
};

// Firestore에 예약 정보 저장하는 비동기 함수
const addReservation = createAsyncThunk(
  "reservation/addReservation",
  async ({ collectionName, docId, updateObj }) => {
    try {
      const resultData = await updateDatas(collectionName, docId, updateObj);
      return resultData;
    } catch (error) {
      console.error("error 메시지", error);
    }
  }
);

// 선택한 좌석 정보를 Firestore에 저장하는 비동기 함수
const addSeats = createAsyncThunk(
  "reservation/addSeats",
  async ({ collectionName, docId, seats }) => {
    try {
      const updateObj = { selectedSeats: seats }; // 좌석 정보를 포함하는 객체
      const resultData = await updateDatas(collectionName, docId, updateObj);
      return resultData;
    } catch (error) {
      console.error("좌석 저장 오류", error);
    }
  }
);

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
    // 좌석 선택 액션
    selectSeats: (state, action) => {
      state.selectedSeats = action.payload; // 좌석 업데이트
    },
    // 전체 예약 상태 초기화
    resetReservation: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addReservation.pending, (state) => {
        state.status = "loading"; // 비동기 요청 중 상태
      })
      .addCase(addReservation.fulfilled, (state, action) => {
        state.status = "succeeded"; // 성공적으로 데이터 처리됨
        state.selectedMovie = null;
        state.selectedRegion = null;
        state.selectedTheater = null;
        state.selectedDate = "";
        state.selectedTime = null;
      })
      .addCase(addReservation.rejected, (state, action) => {
        state.status = "failed"; // 실패 상태
        state.error = action.payload;
      })
      .addCase(addSeats.pending, (state) => {
        state.status = "loading"; // 비동기 요청 중 상태
      })
      .addCase(addSeats.fulfilled, (state, action) => {
        state.status = "succeeded"; // 성공적으로 좌석 정보 처리됨
      })
      .addCase(addSeats.rejected, (state, action) => {
        state.status = "failed"; // 좌석 저장 실패 상태
        state.error = action.payload;
      });
  },
});

// 액션 생성자와 리듀서 export
export const {
  selectMovie,
  selectRegion,
  selectTheater,
  selectDate,
  selectTime,
  selectSeats,
  resetReservation,
} = reservationSlice.actions;

export default reservationSlice.reducer;
export { addReservation, addSeats };
