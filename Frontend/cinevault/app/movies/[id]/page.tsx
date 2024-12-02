'use client';

import { useParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { ArrowLeftCircle, PlusCircleIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '@/components/ui/Review';
import { Input } from '@/components/ui/input';
import { useUser } from '@/app/userContext';

export default function MovieInfo() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const {user} = useUser()
  const placeholderImage = "https://via.placeholder.com/150?text=No+Image"; // Fallback placeholder image

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/movies/${id}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }
    if (!reviewText || !reviewRating) {
      alert("Please provide a review and rating.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/movies/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id, // Replace with actual user ID from context
          comment: reviewText,
          rating: parseInt(reviewRating, 10),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      alert("Review submitted successfully!");
      setReviewText('');
      setReviewRating('');
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const addToWatchlist = async () => {
    if (!user) {
      alert("You need to be logged in to add a movie to your watchlist.");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/user/${user.id}/watchlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: id, // Use the movie ID from the route
        }),
      });
  
      if (response.ok) {
        alert(`${movie.title} has been added to your watchlist!`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add movie to watchlist.");
      }
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  useEffect(() => {
    // Fetch movie details dynamically
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/movies/${id}`); // Replace with your Flask API endpoint
        if (!response.ok) throw new Error('Failed to fetch movie');
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className='h-full'>
      <Header />
      <div className='p-4'>
        <header
          className='flex gap-2 cursor-pointer'
          onClick={() => window.history.back()}
        >
          <ArrowLeftCircle />
          <h1>{movie.title}</h1>
        </header>
        <div className='flex p-4 gap-5'>
          <img
            src={movie.poster_url || placeholderImage} // Replace with a default image if poster_url is missing
            alt={movie.title}
            className='w-56 h-96 rounded-sm'
          />
          <div className='flex flex-col gap-3 py-3'>
            <h1 className='text-3xl font-bold'>{movie.title}</h1>
            <span className='flex gap-2'>
              {Array.isArray(movie.genres) ? (
                movie.genres.map((genre, index) => (
                  <Badge key={index}>{genre}</Badge>
                ))
              ) : (
                // Fallback if `genres` is not an array
                movie.genres.split(', ').map((genre, index) => (
                  <Badge key={index}>{genre}</Badge>
                ))
              )}
            </span>
            <h1 className='text-sm font-medium'>Actors</h1>
            <span className='flex gap-3'>
              {movie.actors.split(', ').map((actor, index) => (
                <p key={index} className='text-green-200'>{actor}</p>
              ))}
            </span>

            <h1 className='text-sm font-medium'>Description</h1>
            <p className='text-green-200'>{movie.overview}</p>
            <div className='flex gap-4 items-center'>
              <p className='border-solid border-green-400 border-4 rounded-full flex items-center justify-center text-center w-14 h-14'>
              {movie.rating}</p>
              <Button variant={"ghost"} onClick={addToWatchlist}><PlusCircleIcon/> Add to watch list</Button>
            </div>
            
            <div className='flex gap-2'>
              <Sheet>
                <SheetTrigger asChild>
                  <Button className='w-28 rounded-xl'>Review</Button>
                </SheetTrigger>
                <SheetContent side={'bottom'} className='flex flex-col px-44'>
                  <SheetHeader>
                    <SheetTitle>Leave a review</SheetTitle>
                    <SheetDescription>
                      What do you think about this movie?
                    </SheetDescription>
                  </SheetHeader>
                  <div className='flex flex-col gap-4'>
                    <Label htmlFor='review' className='text-left'>
                      Review
                    </Label>
                    <Textarea className='border-sold border-slate-200'
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}></Textarea>
                    <Label>Rating</Label>
                    <Input type={"number"} placeholder='Give a rating out of 10' className='w-52'
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}/>
                    <Button className='w-24' onClick={submitReview}>Submit</Button>
                  </div>
                </SheetContent>
              </Sheet>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant={"outline"} className='border-solid border-green-500 border-2 w-28 rounded-xl'  onClick={fetchReviews}>See reviews</Button>
                </SheetTrigger>
                <SheetContent side={"right"}>
                  <SheetHeader>
                    <SheetTitle>Reviews</SheetTitle>
                  </SheetHeader>
                  <div>
                    {loadingReviews ? (
                      <p>Loading reviews...</p>
                    ) : reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <Review
                          key={index}
                          user={review.user}
                          review={review.comment}
                          rating={review.rating}
                        />
                      ))
                    ) : (
                      <p>No reviews yet.</p>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
