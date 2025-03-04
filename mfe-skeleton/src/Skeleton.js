import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import moviesData from '../../db/efreiflix-db.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

const apiKey = '15d2ea6d0dc1d476efbca3eba2b9bbfb';

Modal.setAppElement('#root');

const NetflixStyleMFE = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
    setModalIsOpen(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i <= rating ? 'text-yellow-400' : 'text-gray-400'}
        />
      );
    }
    return stars;
  };

  const groupMoviesByGenre = (movies) => {
    const genres = {};
    movies.forEach((movie) => {
      movie.genres.forEach((genre) => {
        if (!genres[genre]) {
          genres[genre] = [];
        }
        genres[genre].push(movie);
      });
    });
    return genres;
  };

  const moviesByGenre = groupMoviesByGenre(movies);

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto p-6">
        {Object.keys(moviesByGenre).map((genre) => (
          <div key={genre} className="mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">{genre}</h2>
              <div className="border-t-2 border-red-600 flex-1"></div>
            </div>
            <div className="flex overflow-x-scroll space-x-4 scrollbar-hide p-4">
              {moviesByGenre[genre].map((movie) => (
                <div
                  key={movie.id}
                  className="relative cursor-pointer group"
                  onClick={() => handleMovieSelect(movie)}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-72 h-96 object-cover rounded-lg transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Modal pour les détails du film sélectionné */}
        {selectedMovie && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Détails du film"
            className="bg-black text-white p-6 max-w-3xl mx-auto my-20 rounded-lg max-h-[80vh] overflow-y-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
          >
            <h2 className="text-2xl font-bold text-red-500">{selectedMovie.title}</h2>
            <p className="mt-2"><strong>Année :</strong> {selectedMovie.year}</p>
            <p className="mt-2"><strong>Genres :</strong> {selectedMovie.genres.join(', ')}</p>
            <p className="mt-2"><strong>Description :</strong> {selectedMovie.description}</p>
            <p className="mt-2"><strong>Note :</strong> {renderStars(selectedMovie.rating)}</p>
            <div className="relative pt-[56.25%] mt-4 h-48">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={selectedMovie.trailerUrl}
                title={selectedMovie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setModalIsOpen(false)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Fermer
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default NetflixStyleMFE;