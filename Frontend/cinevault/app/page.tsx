import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col my-auto justify-center">
        <h1 className="text-7xl font-bold mx-auto py-6">CineVault</h1>
        <p className="text-3xl mx-auto pb-6">The modern day Alexander's Library of movies.</p>
        <div className="flex gap-2 items-center justify-center">
          <Link href={"/Login"}>
            <Button className="w-28 p-3 rounded-full">Login</Button>
          </Link>
          
          <Button className="w-28 p-3 rounded-full" variant={"outline"}>Sign up</Button>
        </div>
        
      </div>
      
    </div>
  );
}
