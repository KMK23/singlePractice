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
import MyPage from "./pages/MyPage/MyPage";
import Service from "./pages/ServicePage/Service";
import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import Admin from "./pages/Admin/Admin";
import { useSelector } from "react-redux";
import { selectUser } from "./store/userSlice/userSlice";

function App() {
  const user = useSelector(selectUser);

  // 관리자 계정인지 확인
  const isAdmin = user.user?.email === "admin@naver.com";
  return (
    <BrowserRouter>
      <Routes>
        {isAdmin ? (
          <Route path="/*" element={<Admin />} />
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<MovieList />} />
            <Route path="movie" element={<Movie />} />
            <Route path="Login" element={<LoginPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/Reservation" element={<Reservation />} />
            <Route path="SeatSelection" element={<SeatSelection />} />
            <Route path="MyPage" element={<MyPage />} />
            <Route path="editProfile" element={<EditProfilePage />} />

            <Route path="service" element={<Service />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
