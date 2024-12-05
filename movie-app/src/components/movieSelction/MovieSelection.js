import React, { useState } from "react";
import styles from "./MovieSelection.module.scss";

function MovieSelection({ movies, setSelectedMovie, selectedMovie }) {
  const [visibleCount, setVisibleCount] = useState(5); // 처음에 보이는 영화 수

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 5); // 5개씩 추가
  };

  return (
    <div className={styles.movieSelectBtnBox}>
      {movies.slice(0, visibleCount).map((movie) => (
        <div
          key={movie.id}
          className={`${styles.movieCard} ${
            selectedMovie === movie.id ? styles.selected : ""
          }`}
          onClick={() => setSelectedMovie(movie)} // 영화 객체 { id, title } 전달
        >
          <div className={styles.cardContent}>
            <h6 className={styles.movieTitleName}>{movie.title}</h6>
          </div>
        </div>
      ))}
      {visibleCount < movies.length && (
        <button onClick={handleShowMore} className={styles.showMoreButton}>
          더보기
        </button>
      )}
    </div>
  );
}

export default MovieSelection;
