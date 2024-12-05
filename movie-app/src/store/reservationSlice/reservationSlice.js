import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas, updateDatas } from "../../firebase";

// 초기 상태
const initialState = {
  selectedMovie: null, // 선택한 영화 정보 객체 { id, title }
  selectedRegion: null,
  selectedTheater: null,
  selectedDate: "",
  selectedTime: null,
  selectedSeats: [],
  reservedSeats: [], // 예약된 좌석
  status: "idle",
  error: null,
};

// Firestore에서 예약된 좌석 가져오기
const fetchReservedSeats = createAsyncThunk(
  "reservation/fetchReservedSeats",
  async ({ collectionName, queryOptions }) => {
    try {
      const resultData = await getDatas(collectionName, queryOptions);
      // 결과 데이터는 Firestore 문서 배열 형태이므로 필요한 좌석만 추출
      return resultData[0]?.reservedSeats || [];
    } catch (error) {
      console.error("Error fetching reserved seats:", error);
      throw error;
    }
  }
);

// Firestore에 예약된 좌석 추가
const addSeats = createAsyncThunk(
  "reservation/addSeats",
  async ({ collectionName, docId, newSeats }) => {
    try {
      const resultData = await updateDatas(collectionName, docId, {
        reservedSeats: newSeats,
      });
      return resultData.reservedSeats; // 업데이트된 좌석 반환
    } catch (error) {
      console.error("Error adding seats:", error);
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
        state.reservedSeats = action.payload;
      })
      .addCase(fetchReservedSeats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addSeats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addSeats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reservedSeats = action.payload;
      })
      .addCase(addSeats.rejected, (state, action) => {
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
  addReservation,
} = reservationSlice.actions;

// export const { selectMovie, selectRegion, selectTheater, selectDate, selectTime, selectSeats, resetReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
export { addSeats, fetchReservedSeats };
