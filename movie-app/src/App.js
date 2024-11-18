import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MovieList from "./pages/MovieList/MovieList";
import Layout from "./pages/Layout/Layout";
import Movie from "./pages/Movie/Movie";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import BookingPage from "./pages/BookingPage/BookingPage";
import Reservation from "./pages/Reservation/Reservation";
import SeatSelection from "./pages/SeatSelection/SeatSelection";
import LoginPage from "./pages/Login/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MovieList />} />
          <Route path="movie" element={<Movie />} />
          <Route path="Login" element={<LoginPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/Reservation" element={<Reservation />} />
          <Route path="SeatSelection" element={<SeatSelection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
