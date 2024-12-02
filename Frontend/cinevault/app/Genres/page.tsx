'use client';

import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/ui/Header';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Genres() {
  const genres = [
    'Action', 'Adventure', 'Comedy', 'Thriller', 'Horror',
    'Romance', 'Documentaries', 'Sci-Fi', 'Drama', 'Sports',
    'Fantasy', 'Crime', 'Family', 'Western', 'Historical',
  ];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex flex-col p-4 gap-4 my-auto items-center">
        <h1 className={`text-6xl mb-2 ${isVisible ? 'fade-in-float-up' : ''}`}>
          Explore different genres
        </h1>
        <p className={`py-2 ${isVisible ? 'fade-in-float-up' : ''}`}>
          Explore our collection of genres.
        </p>
        <div className="flex flex-wrap justify-center gap-3 w-[55%] text-center">
          {genres.map((genre, index) => (
            <Link key={index} href={`/Genre/${genre}`}>
              <Badge
                key={index}
                variant="outline"
                className={`border-solid border-green-400 text-base hover:bg-green-500 hover:text-slate-950 cursor-pointer ${isVisible ? 'fade-in-float-up-badge' : ''}`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {genre}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
