import { Header } from '@/components/ui/Header'
import { Input } from '@/components/ui/input'
import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SelectContent } from '@radix-ui/react-select'
import { Search } from 'lucide-react'
import React from 'react'

export default function Explore() {
    const genre = ["Action","Adventure","Comedy","Thriller","Horror", "Romance","Documentaries","Sci-Fi","Drama","Sports","Fantasy","Crime","Family","Western","Historical"]
  return (
    <div>
        <Header/>
        <div className='flex flex-col gap-5 p-4'>
            <h1>Explore our vast array of geners</h1>
            <div className='flex items-center gap-2'>
              <Search className=''/>
              <Input placeholder='search for movie' className='rounded-xl w-[50%] border-solid border-slate-500'/>
              <Select>
                <SelectTrigger className='w-44'>
                    <SelectValue placeholder='Select genre'/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className='w-44'>
                        <SelectLabel>Genre</SelectLabel>
                        {genre.map((genre,index)=>(
                            <SelectItem key={index} value={genre}>{genre}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className='w-44'>
                    <SelectValue placeholder='Select actor'/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Actor</SelectLabel>
                        <SelectItem value='actor'>Jonh Doe</SelectItem>
                    </SelectGroup>
                </SelectContent>

              </Select>
              <Select>
                <SelectTrigger className='w-44'>
                    <SelectValue placeholder='Select director'/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Dictionary</SelectLabel>
                        <SelectItem value='actor'>Jonh Doe</SelectItem>
                    </SelectGroup>
                </SelectContent>

              </Select>
            </div>
        </div>
    </div>
  )
}
