import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import styles from "./MovieDetail.module.scss";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState({ crew: [], cast: [] });
  const [images, setImages] = useState([]);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWU2Mjc5NzgxZDBjNjcxOTY0MTU3OGNmYmU1Njk2OCIsIm5iZiI6MTczMDA5MDg3Ny45NDA1NTgsInN1YiI6IjY3MWI2NTM4MzRjMGZhYmQ2ODFjN2M2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dPWaHht1w0mkS5At-coEotUeFQPp3tP2zo0_TyNC5Fg",
        },
      };

      try {
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=ko`,
          options
        );
        const movieData = await movieResponse.json();
        setMovie(movieData);

        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?language=ko`,
          options
        );
        const creditsData = await creditsResponse.json();
        setCredits(creditsData);

        const imagesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/images?language=ko`,
          options
        );
        const imagesData = await imagesResponse.json();
        setImages(
          imagesData.backdrops.length > 0
            ? imagesData.backdrops
            : imagesData.posters
        );

        const trailersResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=ko`,
          options
        );
        const trailersData = await trailersResponse.json();
        setTrailers(trailersData.results);
      } catch (error) {
        console.error("영화 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return <p>로딩중...</p>;

  return (
    <div className={styles.movieDetailContainer}>
      <div className={styles.posterContainer}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className={styles.moviePoster}
        />
        <div className={styles.movieInfo}>
          <h1 className={styles.movieTitle}>{movie.title}</h1>
          <p className={styles.movieTagline}>{movie.tagline}</p>
          <p className={styles.movieReservationRate}>
            평점: {movie.vote_average}
          </p>
          <p className={styles.movieReleaseDate}>개봉: {movie.release_date}</p>
          <p className={styles.movieRuntime}>상영시간: {movie.runtime}분</p>
          <p className={styles.movieGenre}>
            장르: {movie.genres.map((genre) => genre.name).join(", ")}
          </p>
          <p className={styles.movieDirector}>
            감독:{" "}
            {credits.crew.find((member) => member.job === "Director")?.name ||
              "정보 없음"}
          </p>
          <p className={styles.movieCast}>
            출연:{" "}
            {credits.cast
              .slice(0, 5)
              .map((castMember) => castMember.name)
              .join(", ") || "정보 없음"}
          </p>
          <div className={styles.movieOverview}>
            <h2>줄거리</h2>
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* 스틸컷 섹션 */}
      <div className={styles.stillandVideo}>
        <div className={styles.movieImages}>
          <h2>스틸컷</h2>
          <div className={styles.imageContainer}>
            {images.length > 0 ? (
              images
                .slice(0, 5)
                .map((image) => (
                  <img
                    key={image.file_path}
                    src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                    alt={movie.title}
                    className={styles.backdropImage}
                  />
                ))
            ) : (
              <p>포스터 정보가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 트레일러 섹션 */}
        <div className={styles.movieTrailers}>
          <h2>트레일러</h2>
          <div className={styles.trailerContainer}>
            {trailers.length > 0 ? (
              trailers.slice(0, 2).map((trailer) => (
                <div key={trailer.id} className={styles.trailerItem}>
                  <h3>{trailer.name}</h3>
                  <YouTube
                    videoId={trailer.key}
                    className={styles.trailerVideo}
                    opts={{
                      playerVars: {
                        autoplay: 0,
                      },
                    }}
                  />
                </div>
              ))
            ) : (
              <p>트레일러 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
