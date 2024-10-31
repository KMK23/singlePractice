import { configureStore } from "@reduxjs/toolkit";
import movieSlice from "./movieSlice/MovieSlice";
import ReservationSlice from "./reservationSlice/reservationSlice";
const store = configureStore({
  reducer: {
    movies: movieSlice,
    reservation: ReservationSlice,
  },
});
export default store;
