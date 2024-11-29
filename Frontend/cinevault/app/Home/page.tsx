import React from 'react'
import movies from '@/app/constants/index';
import { MovieCard } from '@/components/ui/movieCard';
import { Header } from '@/components/ui/Header';
import Link from 'next/link';

export default function page() {
  return (
    <div className='h-full '>
        <Header/>
        <div className='flex flex-wrap gap-4 justify-center p-3'>
            {movies.map((movie)=>(
            <Link key={movie.id} href={`/movies/${movie.id}`}>
                <MovieCard key={movie.id} id={movie.id} name={movie.name} genre={movie.genre} releaseDate={movie.release_date}/>
            </Link>
             
            ))}
        </div>
        
    </div>
  )
}
