import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Reservation.module.scss";
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

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // 모든 항목이 선택되었는지 확인하는 변수
  const isAllSelected =
    selectedMovie &&
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
          setSelectedMovie={setSelectedMovie}
          selectedMovie={selectedMovie}
        />
        <RegionSelection
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedTheater={selectedTheater}
          setSelectedTheater={setSelectedTheater}
        />
        <DateSelection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <TimeSelection
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      </div>
      {isAllSelected && ( // 모든 항목이 선택되었을 때만 버튼 표시
        <div className={styles.ReservationButton}>
          <Link to={"/SeatSelection"}>좌석선택하기</Link>
        </div>
      )}
    </div>
  );
}

export default Reservation;
