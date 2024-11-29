"use client"
import { useParams } from 'next/navigation';
import { Header } from '@/components/ui/Header'
import { ArrowLeftCircle } from 'lucide-react'
import React, { use } from 'react'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet,SheetContent,SheetHeader, S, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import movies from '@/app/constants/index';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


export default function MovieInfo(


) {
  
  const {id} = useParams()

  const movie = movies.find((movie) => movie.id === id);
  console.log("ID from URL:", id);
  if (!movie) {
    return <div>{ }</div>;
  }
  return (
    <div className='h-full'>
        <Header/>
        <div className='p-2'>
            <header className='flex gap-2 cursor-pointer'
            onClick={() => window.history.back()}>
                <ArrowLeftCircle />
                <h1>{movie.name}</h1>
            </header>
            <div className='flex p-4 gap-5'>
              <img src={"https://scontent.fagc3-2.fna.fbcdn.net/o1/v/t0/f1/m340/genai_m4_lla_rva_v3:upload_media_683780_11_23_2024_11_57_00_395810_4440567683561619586.jpeg?_nc_ht=scontent.fagc3-2.fna.fbcdn.net&_nc_cat=102&ccb=9-4&oh=00_AYCavaBHFobl4hRJP-_hi_KQ4UStkIYDQwwmDA2MOEaXrA&oe=6744199F&_nc_sid=5b3566"} className='w-56 h-96 rounded-sm'/>
              <div className='flex flex-col gap-3 py-3'>
                <h1 className='text-3xl font-bold'>{movie.name}</h1>
                <span className='flex gap-2'>
                  {movie.genre.map((genr,index)=>(
                    <Badge key={index}>{genr}</Badge>
                  ))}
                </span>
                <h1 className='text-sm font-medium'>Actors</h1>
                <span className='flex gap-3'>
                  {movie.actors.map((act,index)=>(
                    <p key={index} className='text-green-200'>{act}</p>
                  ))}
                </span>
                
                <h1 className='text-sm font-medium'>Directors</h1>
                <span className='flex gap-3'>
                  {movie.directors.map((dir,index)=>(
                    <p key={index} className='text-green-200'>{dir}</p>
                  ))}
                </span>
                <h1 className='text-sm font-medium'>Description</h1>
                <p className='text-green-200'>{movie.description}</p>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button>Review</Button>
                  </SheetTrigger>
                  <SheetContent side={"bottom"} className='flex flex-col px-44'>
                    <SheetHeader>
                      <SheetTitle>Leave a review</SheetTitle>
                      <SheetDescription>
                        What do you think about this movie
                      </SheetDescription>
                    </SheetHeader>
                    <div className='flex flex-col gap-4'>
                      <Label htmlFor='review' className='text-left'>
                        Review
                      </Label>
                      <Textarea className='border-sold border-slate-200'></Textarea>
                      <Button className='w-24'>Submit</Button>
                    </div>
                  </SheetContent>
                </Sheet>
                
              </div>
            </div>
            
        </div>
    </div>
  )
}
