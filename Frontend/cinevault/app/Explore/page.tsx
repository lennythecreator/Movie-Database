'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/input';
import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { Search } from 'lucide-react';
import {MovieCard} from '@/components/ui/movieCard'; // Assuming MovieCard is located here

export default function Explore() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedActor, setSelectedActor] = useState('');
  const [selectedDirector, setSelectedDirector] = useState('');

  const genreList = [
    'Action',
    'Adventure',
    'Comedy',
    'Thriller',
    'Horror',
    'Romance',
    'Documentaries',
    'Sci-Fi',
    'Drama',
    'Sports',
    'Fantasy',
    'Crime',
    'Family',
    'Western',
    'Historical',
  ];

  useEffect(() => {
    // Fetch movies from the backend
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/movies');
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        setMovies(data.movies);
        setFilteredMovies(data.movies); // Default filteredMovies to all movies
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    // Filter movies based on selected criteria
    let filtered = movies;

    if (searchQuery) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter((movie) => movie.genres.includes(selectedGenre));
    }

    if (selectedActor) {
      filtered = filtered.filter((movie) => movie.actors?.includes(selectedActor));
    }

    if (selectedDirector) {
      filtered = filtered.filter((movie) => movie.director === selectedDirector);
    }

    setFilteredMovies(filtered);
  }, [searchQuery, selectedGenre, selectedActor, selectedDirector, movies]);

  return (
    <div>
      <Header />
      <div className="flex flex-col gap-5 p-4">
        <h1>Explore our vast array of genres</h1>
        <div className="flex items-center gap-2">
          <Search className="" />
          <Input
            placeholder="Search for movie"
            className="rounded-xl w-[50%] border-solid border-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select onValueChange={(value) => setSelectedGenre(value)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className='w-44'>
              <SelectGroup className="w-44">
                <SelectLabel>Genre</SelectLabel>
                {genreList.map((genre, index) => (
                  <SelectItem key={index} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              name={movie.title}
              image={movie.poster_url}
              genre={movie.genres}
              releaseDate={movie.release_date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
