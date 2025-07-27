'use client';

import { cn } from "@/lib/utils";
import Image from "next/image";

export default function UserAvatar(
  { 
    imgUrl, 
    className, 
    fallbackLetter,
    width=200,
    height=200
  }:
  {
    imgUrl: string | undefined;
    className?: string;
    fallbackLetter: string;
    width: number;
    height: number
  }
) {

  return (
    <div className="grid">
      {imgUrl ? 
        <Image
          src={imgUrl} 
          alt="Avatar" 
          width={width}
          height={height}
          className={cn("rounded-full", className)}
        /> :
        <div className={cn("flex items-center justify-center text-2xl !bg-muted rounded-full", className)}>
          <span>{fallbackLetter}</span>
        </div>
      }
    </div>
  );
}
