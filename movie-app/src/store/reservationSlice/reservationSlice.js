import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../firebase";

// 초기 상태
const initialState = {
  selectedMovie: null, // 선택한 영화 정보 객체 { id, title }
  selectedRegion: null,
  selectedTheater: null,
  selectedDate: "",
  selectedTime: null,
  selectedSeats: [],
  status: "idle",
  error: null,
};

// Firestore에서 예약된 좌석 가져오기
const fetchReservedSeats = createAsyncThunk(
  "reservation/fetchReservedSeats",
  async ({ collectionName, queryOptions }) => {
    try {
      const resultData = await getDatas(collectionName, queryOptions);
      // 모든 문서의 selectedSeats를 합쳐서 예약된 좌석 리스트 반환
      const reservedSeats = resultData.reduce((acc, doc) => {
        return [...acc, ...doc.selectedSeats];
      }, []);
      return reservedSeats;
    } catch (error) {
      console.error("Error fetching reserved seats:", error);
      throw error;
    }
  }
);

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    selectMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    selectRegion: (state, action) => {
      state.selectedRegion = action.payload;
      state.selectedTheater = null;
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
    selectSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    resetReservation: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservedSeats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReservedSeats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedSeats = action.payload; // 예약된 좌석을 상태에 저장
      })
      .addCase(fetchReservedSeats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

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
export { fetchReservedSeats };
