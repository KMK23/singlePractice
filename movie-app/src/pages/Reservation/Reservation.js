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
          selectedMovie={selectedMovie}
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
    </div>
  );
}

export default Reservation;
