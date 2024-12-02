import React from 'react'
import { Avatar, AvatarFallback } from './avatar'

export const Review = ({user,review,rating}) => {
  return (
    <div className='flex gap-3 py-4 items-center'>
        <Avatar>
            <AvatarFallback className='bg-green-400'>{user[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
            <h1 className='font-medium text-green-500 opacity-70'>{user}</h1>
            <p>{review}</p>
        </div>
        <p className='text-lg text-green-500 ml-auto'>{rating}/10</p>
    </div>
  )
}
