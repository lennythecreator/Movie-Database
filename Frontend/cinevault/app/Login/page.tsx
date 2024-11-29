"use client"
import React from 'react'
import { Form,FormControl,FormField, FormItem, FormLabel } from '@/components/ui/form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Lottie from "lottie-react"
import animationData from '@/app/lotties/MovieClip.json'
export default function Login () {
  const formSchema = z.object({
    username : z.string().min(1).max(18),
    password: z.string().min(3)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password:"",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className='h-full flex p-4 overflow-hidden'>
        <div className='flex flex-col justify-center gap-4 px-24 w-[50%]'>
          <h1 className='text-2xl'>Let's Get Started</h1>
          <p>Welcome to CineVault</p>
          <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
              <FormField control={form.control} 
              name="username"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input className='w-[70%] p-5 bg-slate-200 text-gray-700' placeholder="Please enter you username" {...field}/>
                  </FormControl>
                </FormItem>
              )} ></FormField>

              <FormField control={form.control}
              name="password"
              render={({field})=> (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className='w-[70%] bg-slate-200 text-gray-700' type='password' placeholder='enter your password' {...field}/>
                </FormControl>
              </FormItem>
              )}>
                  
              </FormField>
              <Button type='submit' className='w-[70%]'>Submit</Button>
            </form>
            
          </Form>
        </div>
        <div className='rounded-xl w-[50%]'>
          <Lottie className='pb-10' animationData={animationData} />
        </div>
    </div>
  )
}
