'use client';

import { cn } from "@/lib/utils";
import Image from "next/image";

export default function UserAvatar(
  { imgUrl, className, fallbackLetter }:
  {
    imgUrl: string | undefined;
    className?: string;
    fallbackLetter: string;
  }
) {

  return (
    <div>
      {imgUrl !== null && imgUrl !== undefined ? 
        <Image
          src={imgUrl} 
          alt="Avatar" 
          width={200}
          height={200}
          className={cn("rounded-full", className)}
        /> :
        <div className={cn("flex items-center justify-center text-2xl !bg-muted rounded-full", className)}>
          <span>{fallbackLetter}</span>
        </div>
      }
    </div>
  );
}
