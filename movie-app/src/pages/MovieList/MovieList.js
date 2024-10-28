import React, { useEffect, useState } from "react";
import styles from "./MovieList.module.scss";
import MovieDetail from "../Movie/Movie";
import Pagination from "@mui/material/Pagination"; // Pagination 컴포넌트 추가

function Main() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 10; // 페이지 당 표시할 영화 개수

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWU2Mjc5NzgxZDBjNjcxOTY0MTU3OGNmYmU1Njk2OCIsIm5iZiI6MTczMDA5MDg3Ny45NDA1NTgsInN1YiI6IjY3MWI2NTM4MzRjMGZhYmQ2ODFjN2M2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dPWaHht1w0mkS5At-coEotUeFQPp3tP2zo0_TyNC5Fg",
      },
    };

    fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=ko&page=1&region=KR",
      options
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMovies(data.results);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (event, value) => {
    setPage(value); // 페이지 변경 시 상태 업데이트
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedMovies = movies.slice(startIndex, endIndex); // 현재 페이지에 맞는 영화 목록

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.mainTitle}>현재 상영중인 영화</h1>
      <div className={styles.mainMovieGrid}>
        {displayedMovies.map((movie) => (
          <div key={movie.id} className={styles.mainMovieCard}>
            <MovieDetail movie={movie} />
          </div>
        ))}
      </div>
      <Pagination
        count={Math.ceil(movies.length / itemsPerPage)} // 전체 페이지 수 계산
        page={page} // 현재 페이지
        onChange={handleChange} // 페이지 변경 핸들러
        color="primary" // 기본 색상 설정
        variant="outlined" // 버튼 스타일
        shape="rounded" // 모서리 둥글게
        sx={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          "& .MuiPaginationItem-root": {
            color: "white", // 숫자 색상 설정
          },
          "& .MuiPaginationItem-previousNext": {
            color: "white", // 이전, 다음 버튼 색상 설정
          },
        }} // 스타일 조정
      />
    </div>
  );
}

export default Main;
