'use client';

import { useParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { MovieCard } from '@/components/ui/movieCard';
import React, { useEffect, useState } from 'react';

export default function GenrePage() {
  const { genre } = useParams(); // Get the genre from the URL
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/genres/${genre}/movies`);
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        setMovies(data.movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (genre) fetchMoviesByGenre();
  }, [genre]);

  if (loading) {
    return <div>Loading movies...</div>;
  }

  return (
    <div className="h-full">
      <Header />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">{genre} Movies</h1>
        <div className="flex flex-wrap gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              name={movie.title}
              genre={genre}
              releaseDate={movie.release_date}
              image={movie.poster_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
