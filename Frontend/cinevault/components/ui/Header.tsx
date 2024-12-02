import Link from 'next/link'
import React from 'react'
import { Input } from './input'
import { FilmIcon, Search } from 'lucide-react'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback } from './avatar'
import { useUser } from '@/app/userContext'

export const Header = () => {
  const { user } = useUser();
  console.log(user)
  return (
    <header className='sticky top-0 z-50 mb-2 w-full border-b border-b-solid border-b-slate-500 bg-background/95 backdrop-blur p-3'>
        <div className='flex gap-2 items-center'>
            <FilmIcon/>
            <Link href={'/Home'}>
              <span className='text-xl font-bold mr-4 cursor-pointer'>CineVault</span>
            </Link>
            <nav className='flex flex-1 gap-4 items-center'>
                <Link href={"/Genres"}>Genres</Link>
                <Link href={"/Explore"}>Explore</Link>
                {user && user.userType === 'admin' && <Link href={"/Admin"}>Admin</Link>}
                <div className='flex items-center gap-2 ml-auto'>
                  <Search size={20}/>
                  <Input placeholder='Find a movie' className='w-64 border-solid border-slate-500'/>
                  <Link href={'/Profile'}>
                    <Avatar>
                      <AvatarFallback className='bg-red-500 w-7 h-7'>U</AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
            </nav>
        </div>
    </header>
  )
}

