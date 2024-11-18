import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Reservation.module.scss";
import { addReservation } from "../../store/reservationSlice/reservationSlice";
import {
  fetchMovies,
  selectMovies,
  selectLoading,
  selectError,
} from "../../store/movieSlice/MovieSlice";
import MovieSelection from "../../components/movieSelction/MovieSelection";
import RegionSelection from "../../components/regionSelection/RegionSelection";
import DateSelection from "../../components/dateSelection/DateSelection";
import TimeSelection from "../../components/timeSelection/TimeSelection";
import { Link } from "react-router-dom";

function Reservation() {
  const dispatch = useDispatch();
  const movies = useSelector(selectMovies);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const {
    selectedMovie,
    selectedRegion,
    selectedTheater,
    selectedDate,
    selectedTime,
    selectedSeats,
  } = useSelector((state) => state.reservation);

  const user = localStorage.getItem("email");
  const [selectedMovieLocal, setSelectedMovieLocal] = useState(
    selectedMovie || ""
  );
  const [selectedRegionLocal, setSelectedRegionLocal] = useState(
    selectedRegion || ""
  );
  const [selectedTheaterLocal, setSelectedTheaterLocal] = useState(
    selectedTheater || ""
  );
  const [selectedDateLocal, setSelectedDateLocal] = useState(
    selectedDate || ""
  );
  const [selectedTimeLocal, setSelectedTimeLocal] = useState(
    selectedTime || ""
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const isAllSelected =
    selectedMovieLocal &&
    selectedRegionLocal &&
    selectedTheaterLocal &&
    selectedDateLocal &&
    selectedTimeLocal.length > 0;

  console.log("isAllSelected", isAllSelected); // 로그로 확인

  const handleSubmitReservation = () => {
    const userId = user;
    const reservationData = {
      selectedMovie: selectedMovieLocal,
      selectedRegion: selectedRegionLocal,
      selectedTheater: selectedTheaterLocal,
      selectedDate: selectedDateLocal,
      selectedTime: selectedTimeLocal,
    };

    dispatch(
      addReservation({
        collectionName: "users",
        docId: userId,
        updateObj: reservationData,
      })
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.ReservationContainer}>
      <h1>영화 예약</h1>
      <div className={styles.ReservationSteps}>
        <MovieSelection
          movies={movies}
          selectedMovie={selectedMovieLocal}
          setSelectedMovie={setSelectedMovieLocal}
        />
        <RegionSelection
          selectedRegion={selectedRegionLocal}
          setSelectedRegion={setSelectedRegionLocal}
          selectedTheater={selectedTheaterLocal}
          setSelectedTheater={setSelectedTheaterLocal}
        />
        <DateSelection
          selectedDate={selectedDateLocal}
          setSelectedDate={setSelectedDateLocal}
        />
        <TimeSelection
          selectedTime={selectedTimeLocal}
          setSelectedTime={setSelectedTimeLocal}
        />
      </div>

      {isAllSelected && (
        <div className={styles.ReservationButton}>
          <Link
            to="/SeatSelection"
            state={{
              selectedMovie: selectedMovieLocal,
              selectedRegion: selectedRegionLocal,
              selectedTheater: selectedTheaterLocal,
              selectedDate: selectedDateLocal,
              selectedTime: selectedTimeLocal,
            }}
          >
            <button>좌석선택하기</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Reservation;
