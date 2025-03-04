import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import moviesData from '../../db/efreiflix-db.json';

const apiKey = '15d2ea6d0dc1d476efbca3eba2b9bbfb';

const NetflixStyleMFE = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMoviePosters = async () => {
      const moviePromises = moviesData.movies.map(async (movie) => {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie.title}`
        );
        const posterPath = response.data.results[0]?.poster_path;
        return {
          ...movie,
          posterUrl: `http://image.tmdb.org/t/p/w500/${posterPath}`,
        };
      });
      const moviesWithPosters = await Promise.all(moviePromises);
      setMovies(moviesWithPosters);
    };

    fetchMoviePosters();
  }, []);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Navbar Netflix Centré */}
      <nav className="p-4 flex justify-center">
        <h1 className="text-red-600 text-3xl font-bold">NETFLIX</h1>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* TOP 5 Films France */}
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">TOP 5 Films France</h2>
          <div className="border-t-2 border-red-600 flex-1"></div>
        </div>

        {/* Liste des films */}
        <div className="flex overflow-x-scroll space-x-4 scrollbar-hide p-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative cursor-pointer group"
              onClick={() => handleMovieSelect(movie)}
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-60 h-36 object-cover rounded-lg transition-transform transform group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {movie.title}
              </div>
            </div>
          ))}
        </div>

        {/* Trailer sélectionné */}
        {selectedMovie && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-red-500">{selectedMovie.title} - Trailer</h2>
            <div className="relative pt-[56.25%] mt-4">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={selectedMovie.trailerUrl}
                title={selectedMovie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetflixStyleMFE;
