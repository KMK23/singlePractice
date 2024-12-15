import { configureStore } from "@reduxjs/toolkit";
import movieSlice from "./movieSlice/MovieSlice";
import ReservationSlice from "./reservationSlice/reservationSlice";
import userSlice from "./userSlice/userSlice";
import chatSlice from "./chatSlice/chatSlice";
const store = configureStore({
  reducer: {
    movies: movieSlice,
    reservation: ReservationSlice,
    user: userSlice,
    chat: chatSlice,
  },
});
export default store;
