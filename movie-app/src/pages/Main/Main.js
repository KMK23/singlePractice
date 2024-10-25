import React, { useEffect, useState } from "react";

function Main() {
  const [movies, setMovies] = useState([]);
  const kobisApiKey = "4fd090977fedd0f3524098e53b70c8d7"; // KOBIS API 키
  const tmdbApiKey = "dee6279781d0c6719641578cfbe56968"; // TMDb API 키

  const fetchMovies = async () => {
    // KOBIS API로 상영 중인 영화 정보 가져오기
    const kobisResponse = await fetch(
      `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${kobisApiKey}&targetDt=20241024`
    );
    const kobisData = await kobisResponse.json();
    const movieList = kobisData.boxOfficeResult.dailyBoxOfficeList;

    // TMDb API로 포스터 정보 가져오기
    const movieDetailsPromises = movieList.map(async (movie) => {
      // KOBIS movieCd를 사용하여 TMDb에서 영화 검색
      const tmdbSearchResponse = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&language=ko&query=${encodeURIComponent(
          movie.movieNm
        )}`
      );
      console.log(tmdbSearchResponse);
      const tmdbSearchData = await tmdbSearchResponse.json();
      console.log(tmdbSearchData);
      // 검색 결과에서 첫 번째 영화를 가져옴
      const tmdbMovie = tmdbSearchData.results[0];

      // 포스터 경로가 존재하면 추가
      const posterPath = tmdbMovie ? tmdbMovie.poster_path : null;

      return { ...movie, posterPath }; // 포스터 경로 추가
    });

    const movieDetails = await Promise.all(movieDetailsPromises);
    setMovies(movieDetails);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      {movies.map((movie) => (
        <div key={movie.movieCd}>
          <h3>{movie.movieNm}</h3>
          {movie.posterPath && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.movieNm}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Main;
