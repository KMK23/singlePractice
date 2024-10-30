// src/contexts/MovieContext.js
import React, { createContext, useState, useEffect } from "react";

export const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWU2Mjc5NzgxZDBjNjcxOTY0MTU3OGNmYmU1Njk2OCIsIm5iZiI6MTczMDA5MDg3Ny45NDA1NTgsInN1YiI6IjY3MWI2NTM4MzRjMGZhYmQ2ODFjN2M2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dPWaHht1w0mkS5At-coEotUeFQPp3tP2zo0_TyNC5Fg",
        },
      };

      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?language=ko&page=1&region=KR",
          options
        );
        const data = await res.json();
        setMovies(data.results);
        console.log("Fetched movies:", data.results); // 확인용 로그
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <MovieContext.Provider value={{ movies, loading }}>
      {children}
    </MovieContext.Provider>
  );
}
