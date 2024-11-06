import { configureStore } from "@reduxjs/toolkit";
import movieSlice from "./movieSlice/MovieSlice";
import ReservationSlice from "./reservationSlice/reservationSlice";
import userSlice from "./userSlice/userSlice";
const store = configureStore({
  reducer: {
    movies: movieSlice,
    reservation: ReservationSlice,
    userSlice,
  },
});
export default store;
