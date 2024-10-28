import React from "react";
import styles from "./Movie.module.scss";
import { Link } from "react-router-dom";

function Movie({ movie }) {
  const getOverviewText = () => {
    const textLimit = window.innerWidth < 150 ? 100 : 80;
    return movie.overview.length > textLimit
      ? movie.overview.slice(0, textLimit) + "..."
      : movie.overview;
  };

  if (!movie) return <p>로딩중...</p>;

  return (
    <div className={styles.movieDetailCard}>
      <Link to={`/movie/${movie.id}`} className={styles.movieDetailLink}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className={styles.movieDetailPoster}
        />
        <div className={styles.movieInfo}>
          <h2 className={styles.movieDetailTitle}>{movie.title}</h2>
          <p className={styles.movieDetailRating}>
            평점: {movie.vote_average.toFixed(1)}
          </p>
          <p className={styles.movieDetailReleaseDate}>
            개봉일: {movie.release_date}
          </p>
        </div>
        <div className={styles.movieOverview}>
          <p className={styles.movieDetailOverview}>{getOverviewText()}</p>
        </div>
      </Link>
    </div>
  );
}

export default Movie;
