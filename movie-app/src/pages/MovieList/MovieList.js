import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMovies,
  selectMovies,
  selectLoading,
} from "../../store/movieSlice/MovieSlice"; // 선택자 추가
import styles from "./MovieList.module.scss";
import MovieDetail from "../Movie/Movie";
import Pagination from "@mui/material/Pagination";

function MovieList() {
  const dispatch = useDispatch();
  const movies = useSelector(selectMovies); // Redux 상태에서 영화 목록 가져오기
  const loading = useSelector(selectLoading); // Redux 상태에서 로딩 상태 가져오기
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchMovies()); // 컴포넌트가 마운트될 때 영화 데이터를 가져옵니다.
  }, [dispatch]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedMovies = movies.slice(startIndex, endIndex);

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.mainTitle}>현재 상영중인 영화</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.mainMovieGrid}>
          {displayedMovies.map((movie) => (
            <div key={movie.id} className={styles.mainMovieCard}>
              <MovieDetail movie={movie} />
            </div>
          ))}
        </div>
      )}
      <Pagination
        count={Math.ceil(movies.length / itemsPerPage)}
        page={page}
        onChange={handleChange}
        color="primary"
        variant="outlined"
        shape="rounded"
        sx={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          "& .MuiPaginationItem-root": {
            color: "white",
          },
          "& .MuiPaginationItem-previousNext": {
            color: "white",
          },
        }}
      />
    </div>
  );
}

export default MovieList;
