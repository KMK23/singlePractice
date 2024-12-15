// Reservation.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Reservation.module.scss";
import {
  addReservation,
  selectDate,
  selectMovie,
  selectRegion,
  selectTheater,
  selectTime,
} from "../../store/reservationSlice/reservationSlice";
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
    selectedMovie, // { id, title }
    selectedRegion,
    selectedTheater,
    selectedDate,
    selectedTime,
  } = useSelector((state) => state.reservation);

  const [selectedMovieLocal, setSelectedMovieLocal] = useState(
    selectedMovie || {}
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleMovieSelection = (movie) => {
    setSelectedMovieLocal(movie); // 로컬 상태 업데이트
    dispatch(selectMovie(movie)); // Redux 상태 업데이트
  };
  const isAllSelected =
    selectedMovieLocal.id &&
    selectedRegion &&
    selectedTheater &&
    selectedDate &&
    selectedTime;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.ReservationContainer}>
      <h1>영화 예약</h1>
      <div className={styles.ReservationSteps}>
        <MovieSelection
          movies={movies}
          selectedMovie={selectedMovieLocal.id} // 선택된 영화 ID 전달
          setSelectedMovie={handleMovieSelection}
        />
        <RegionSelection
          selectedRegion={selectedRegion}
          setSelectedRegion={(region) => dispatch(selectRegion(region))}
          selectedTheater={selectedTheater}
          setSelectedTheater={(theater) => dispatch(selectTheater(theater))}
        />
        <div className="dateTimeSelect">
          <DateSelection
            selectedDate={selectedDate}
            setSelectedDate={(date) => dispatch(selectDate(date))}
          />
          <TimeSelection
            selectedTime={selectedTime}
            setSelectedTime={(time) => dispatch(selectTime(time))}
          />
        </div>
      </div>

      {isAllSelected && (
        <div className={styles.ReservationButton}>
          <Link
            to="/SeatSelection"
            state={{
              selectedMovie: selectedMovieLocal,
              selectedRegion,
              selectedTheater,
              selectedDate,
              selectedTime,
            }}
            className={styles.seatSelectLink} // Link에 클래스 추가
          >
            <button className={styles.seatSeletBtn}>좌석선택하기</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Reservation;
