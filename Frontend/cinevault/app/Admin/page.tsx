"use client"
import { Header } from '@/components/ui/Header'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  rating: number;
  poster_path: string;
  actors: string;
  genres: string[];
}


export default function Admin() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMovie, setNewMovie] = useState({
    title: '',
    release_date: '',
    overview: '',
    rating: '',
    poster_path: '',
    actors: '',
    genres: '',
  });
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

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
    const results = movies.filter(
      movie =>
        movie &&
        typeof movie.title === 'string' &&
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(results);
  }, [searchTerm, movies]);
  

  const handleAddMovie = async () => {
    if (
      !newMovie.title ||
      !newMovie.release_date ||
      !newMovie.overview ||
      !newMovie.rating ||
      !newMovie.actors
    ) {
      alert('Please fill in all required fields');
      return;
    }
  
    try {
      const payload = {
        ...newMovie,
        rating: parseFloat(newMovie.rating),
        genres: newMovie.genres.split(',').map(genre => genre.trim()),
      };
  
      if (!newMovie.poster_path) {
        delete payload.poster_path;
      }
  
      const response = await fetch('http://127.0.0.1:5000/api/movies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error('Failed to add movie');
  
      const result = await response.json();
  
      // Validate the response structure
      if (result.movie_id && payload.title) {
        setMovies([
          ...movies,
          {
            id: result.movie_id,
            title: payload.title,
            release_date: payload.release_date,
            overview: payload.overview,
            rating: payload.rating,
            poster_path: payload.poster_path || '',
            actors: payload.actors,
            genres: payload.genres,
          },
        ]);
      }
  
      setNewMovie({
        title: '',
        release_date: '',
        overview: '',
        rating: '',
        poster_path: '',
        actors: '',
        genres: '',
      });
      alert('Movie added successfully');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie');
    }
  };
  

  const handleRemoveMovie = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/movies/${id}/delete`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove movie');
      setMovies(movies.filter(movie => movie.id !== id));
    } catch (error) {
      console.error('Error removing movie:', error);
    }
  };

  const handleUpdateMovie = async () => {
    if (!editingMovie) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/movies/${editingMovie.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMovie),
      });
      if (!response.ok) throw new Error('Failed to update movie');
      const updatedMovie = await response.json();
      setMovies(movies.map(movie => movie.id === updatedMovie.id ? updatedMovie : movie));
      setEditingMovie(null);
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Movie Database Admin</h1>
        
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Add New Movie</h2>
          <div className="grid grid-cols-3 p-4 gap-4 bg-gray-500 bg-opacity-35 rounded-lg">
            <Input
              type="text"
              placeholder="Title"
              value={newMovie.title}
              onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
            />
            <Input
              type="date"
              placeholder="Release Date"
              value={newMovie.release_date}
              onChange={(e) => setNewMovie({...newMovie, release_date: e.target.value})}
            />
            <Input
              type="text"
              placeholder="Poster Path (Optional)"
              value={newMovie.poster_path}
              onChange={(e) => setNewMovie({...newMovie, poster_path: e.target.value})}
            />
            <Textarea
              placeholder="Overview"
              value={newMovie.overview}
              onChange={(e) => setNewMovie({...newMovie, overview: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Rating"
              value={newMovie.rating}
              onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
            />
            <Input
              type="text"
              placeholder="Actors (comma-separated)"
              value={newMovie.actors}
              onChange={(e) => setNewMovie({...newMovie, actors: e.target.value})}
            />
            <Input
              type="text"
              placeholder="Genres (comma-separated)"
              value={newMovie.genres}
              onChange={(e) => setNewMovie({...newMovie, genres: e.target.value})}
            />
            <Button onClick={handleAddMovie}>Add Movie</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.director}</TableCell>
                <TableCell>{movie.year}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setEditingMovie(movie)}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Movie</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {/* Title */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input
                              id="title"
                              value={editingMovie?.title || ''}
                              onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          
                          {/* Release Date */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="release_date" className="text-right">Release Date</Label>
                            <Input
                              id="release_date"
                              type="date"
                              value={editingMovie?.release_date || ''}
                              onChange={(e) => setEditingMovie({ ...editingMovie, release_date: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          
                          {/* Overview */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="overview" className="text-right">Overview</Label>
                            <Input
                              id="overview"
                              value={editingMovie?.overview || ''}
                              onChange={(e) => setEditingMovie({ ...editingMovie, overview: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          
                          {/* Rating */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rating" className="text-right">Rating</Label>
                            <Input
                              id="rating"
                              type="number"
                              value={editingMovie?.rating || ''}
                              onChange={(e) => setEditingMovie({ ...editingMovie, rating: parseFloat(e.target.value) })}
                              className="col-span-3"
                            />
                          </div>
                          
                          {/* Poster Path */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="poster_path" className="text-right">Poster URL</Label>
                            <Input
                              id="poster_path"
                              value={editingMovie?.poster_path || ''}
                              onChange={(e) => setEditingMovie({ ...editingMovie, poster_path: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          
                          {/* Actors */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="actors" className="text-right">Actors</Label>
                            <Input
                              id="actors"
                              value={editingMovie?.actors || ''}
                              onChange={(e) => setEditingMovie({ ...editingMovie, actors: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          
                          {/* Genres */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="genres" className="text-right">Genres</Label>
                            <Input
                              id="genres"
                              placeholder="Comma-separated genres"
                              value={editingMovie?.genres?.join(', ') || ''}
                              onChange={(e) => setEditingMovie({ ...editingMovie, genres: e.target.value.split(',').map(genre => genre.trim()) })}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={handleUpdateMovie}>Update Movie</Button>
                      </DialogContent>
                    </Dialog>

                    <Button variant="destructive" onClick={() => handleRemoveMovie(movie.id)}>Remove</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}

