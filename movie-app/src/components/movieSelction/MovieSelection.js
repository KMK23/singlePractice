import React from "react";
import styles from "./MovieSelection.module.scss";

function MovieSelection({ movies, setSelectedMovie, selectedMovie }) {
  return (
    <div>
      {movies.map((movie) => (
        <button
          key={movie.id}
          onClick={() => setSelectedMovie(movie.title)}
          className={selectedMovie === movie.title ? styles.selected : ""}
        >
          {movie.title}
        </button>
      ))}
    </div>
  );
}

export default MovieSelection;
