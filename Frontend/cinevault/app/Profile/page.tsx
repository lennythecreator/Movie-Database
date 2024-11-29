import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Header } from '@/components/ui/Header'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

export default function Profile() {
  return (
    <div className='h-full'>
        <Header/>
        <div className='flex flex-col p-4 gap-4'>
          <div className='flex gap-5'>
            <div className='bg-slate-700 h-56 w-56 rounded-2xl flex items-center justify-center'> 
              <Avatar className='w-24 h-24 '>
                <AvatarFallback className='bg-red-500'>U</AvatarFallback>
              </Avatar>
            </div>
            
            <div className='flex flex-col mt-auto'> 
              <h1 className='text-3xl'>Username</h1>
              <span>
                <p>Reviews</p>
                <p>15</p>
              </span>
            </div>
          </div>
          <Separator/>
          <div>
            <Tabs defaultValue='Reviews'>
              <TabsList className='grid w-full grid-cols-2 bg-slate-500 text-slate-950'>
                <TabsTrigger value='Reviews' >Reviews</TabsTrigger>
                <TabsTrigger value='Favorites'>Favorites</TabsTrigger>
              </TabsList>
              <TabsContent value='Reviews'>
                  <Card className='h-36 p-4'>
                    <CardHeader>The Dark Knight</CardHeader>
                    <CardContent>
                      <p>I really liked this movie</p>
                    </CardContent>
                  </Card>
              </TabsContent>
            </Tabs>
          </div>

        </div>
    </div>
  )
}
