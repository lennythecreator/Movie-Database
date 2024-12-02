"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import animationData from "@/app/lotties/MovieClip.json";
import { useUser } from "../userContext";

export default function Login() {
  const { setUser } = useUser(); // Access the user context
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(1, "Username is required").max(18),
    password: z.string().min(3, "Password must be at least 3 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("http://127.0.0.1:5000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        const user = result.user; // Assuming backend sends user object in response
        setUser({
          id: user.id, // Include the user ID
          username: user.username, // Use user.username from the backend
          userType: user.user_type, // Use user.user_type from the backend
        });
        console.log(user)
        router.push("/Profile"); // Redirect to profile
      } else if (response.status === 409) {
        alert("Username already taken. Please choose a different one.");
      } else {
        alert(result.message || "An error occurred");
      }
    } catch (error) {
      alert("Server error. Please try again.");
      console.error("Error:", error);
    }
  }

  return (
    <div className="h-full flex p-4 overflow-hidden">
      <div className="flex flex-col justify-center gap-4 px-24 w-[50%]">
        <h1 className="text-2xl">Welcome to CineVault</h1>
        <p>Login or Sign Up</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[70%] p-5 bg-slate-200 text-gray-700"
                      placeholder="Please enter your username"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[70%] bg-slate-200 text-gray-700"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>

            <Button type="submit" className="w-[70%]">
              Login / Sign Up
            </Button>
          </form>
        </Form>
      </div>
      <div className="rounded-xl w-[50%]">
        <Lottie className="pb-10" animationData={animationData} />
      </div>
    </div>
  );
}
