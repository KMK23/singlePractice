import { configureStore } from "@reduxjs/toolkit";
import ReservationSlice from "../pages/Reservation/Reservation";
import movieSlice from "./movieSlice/MovieSlice";
const store = configureStore({
  reducer: {
    movies: movieSlice,
    Reservation: ReservationSlice,
  },
});
export default store;
