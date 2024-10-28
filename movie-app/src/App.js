import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MovieList from "./pages/MovieList/MovieList";
import Layout from "./pages/Layout/Layout";
import Movie from "./pages/Movie/Movie";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import BookingPage from "./pages/BookingPage/BookingPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MovieList />} />
          <Route path="movie" element={<Movie />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/booking" element={<BookingPage />} />{" "}
          {/* 예매 페이지 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
