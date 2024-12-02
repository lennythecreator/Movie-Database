'use client';

import React, { useEffect, useState } from 'react';
import { MovieCard } from '@/components/ui/movieCard';
import { Header } from '@/components/ui/Header';
import Link from 'next/link';

export default function HomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch recently released movies
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/movies/recent');
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        setMovies(data.movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className='h-full'>
      <Header />
      <div className='flex flex-wrap gap-4 justify-center p-3'>
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <MovieCard
              id={movie.id}
              name={movie.title}
              genre={movie.genres}
              releaseDate={movie.release_date}
              image={movie.poster_url} // Pass poster URL
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
