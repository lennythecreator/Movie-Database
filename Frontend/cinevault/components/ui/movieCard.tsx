"use client"
import React from 'react'
import { useState } from 'react'
import { Card,CardContent,CardFooter,CardHeader } from './card'
import { Dot } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export const MovieCard = ({id,name,genre,releaseDate,image}) => {
    const [isHovered,setIsHovered] = useState(false);
    const placeholderImage = "https://via.placeholder.com/150?text=No+Image"; // Fallback placeholder image

     // Event handlers
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const router = useRouter();

    const handleClick = () => {
        router.push(`/movies/${id}`);
    };
    
  return (
    
        <div className='w-56 h-96 flex flex-col rounded-lg m-1'
        style={{
            transition: "transform 0.3s, color 0.3s",
            transform: isHovered ? "scale(1.1)": "scale(1)",
            padding: "10px",
            cursor: "pointer"
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        >
            <img  alt={name || "No Title"}
            src={image || placeholderImage} // Use placeholder if image is null/undefined
            className="h-full rounded-lg"/>
            <div className='mt-auto rounded-b-lg'>
                <header className='font-medium text-base hover:text-green-500'
                style={{color: isHovered ? "#48bb78": "",}}>{name}</header>
                <footer className='flex flex-wrap font-light text-sm'>
                    {Array.isArray(genre) ? (
                        genre.map((gen, index) => (
                        <p key={index} className='flex flex-wrap gap-2 mr-2 text-sm truncate'>
                            {gen}
                        </p>
                        ))
                    ) : (
                        genre?.split(', ').map((gen, index) => (
                        <p key={index} className='flex flex-wrap gap-2 mr-2 text-sm truncate'>
                            {gen}
                        </p>
                        )) || <p className='text-sm'>No genres available</p>
                    )}
                </footer>
                <footer className='text-sm'>{releaseDate}</footer>
            </div>
            
        </div>
    
    
  )
}
