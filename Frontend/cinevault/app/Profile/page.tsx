'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Header } from '@/components/ui/Header';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useState, useEffect } from 'react';
import { useUser } from '../userContext';

export default function Profile() {
  const { user } = useUser(); // Access the user from context
  const [watchList, setWatchList] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Guard: Only fetch data if user is available

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/user/${user.id}/profile`);
        if (!response.ok) throw new Error('Failed to fetch user profile');
        const data = await response.json();
        setWatchList(data.watchlist);
        setReviews(data.reviews);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (!user) {
    return <div>User not logged in</div>;
  }

  return (
    <div className='h-full'>
      <Header />
      <div className='flex flex-col p-4 gap-4'>
        <div className='flex gap-5'>
          <div className='bg-slate-700 h-56 w-56 rounded-2xl flex items-center justify-center'>
            <Avatar className='w-24 h-24'>
              <AvatarFallback className='bg-red-500'>{user.username}</AvatarFallback>
            </Avatar>
          </div>

          <div className='flex flex-col mt-auto'>
            <h1 className='text-3xl'>{user.username}</h1>
          </div>
        </div>
        <Separator />
        <div>
          <Tabs defaultValue='Watchlist'>
            <TabsList className='grid w-full grid-cols-2 bg-slate-500 text-slate-950'>
              <TabsTrigger value='Watchlist'>Watchlist</TabsTrigger>
              <TabsTrigger value='Reviews'>Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value='Watchlist'>
              {loading ? (
                <p>Loading watchlist...</p>
              ) : watchList.length > 0 ? (
                watchList.map((movie) => (
                  <Card key={movie.id} className='flex items-center h-36 p-4'>
                    <img src={movie.poster_url} className='h-24 w-24 rounded-sm'/>
                    <div className='flex flex-col'>
                      <CardHeader>{movie.title}</CardHeader>
                      <CardContent>
                        <p>Release Date: {movie.release_date}</p>
                        <p>Rating: {movie.rating}</p>
                      </CardContent>
                    </div>
                    
                  </Card>
                ))
              ) : (
                <p>No movies in watchlist</p>
              )}
            </TabsContent>
            <TabsContent value="Reviews">
              {loading ? (
                <p>Loading reviews...</p>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <Card key={index} className="h-36 p-2">
                    <CardHeader>{review.movie_title || 'Unknown Movie'}</CardHeader>
                    <CardContent>
                      <p>{review.text || 'No review text provided'}</p>
                      <p>Rating: {review.rating}/10</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No reviews yet</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
