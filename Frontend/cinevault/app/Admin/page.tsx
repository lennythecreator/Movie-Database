import { Header } from '@/components/ui/Header'
import React from 'react'

export default function Admin() {
  return (
   <div>
     <Header/>
     <div>
       <h1>Admin</h1>
       <div>
          <h1>Actions</h1>
          <div className='flex gap-4'>
            <p className='p-4 bg-green-400 rounded-xl'>Add movie</p>
            <p className='p-4 bg-red-400 rounded-xl'>Remove movie</p>
          </div>
       </div>     
     </div>
   </div>
  )
}
