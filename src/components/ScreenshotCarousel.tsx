'use client';

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import styles from "@/styles/ScreenshotCarousel.module.css";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = 5;

export default function ScreenshotCarousel() {
  const [ emblaRef, emblaApi ] = useEmblaCarousel({ loop: true });
  const [ selectedIndex, setSelectedIndex ] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
  }, [emblaApi]);

  const onDotButtonClick = (index: number) => {
    emblaApi?.scrollTo(index);
    setSelectedIndex(index);
  }

  console.log(emblaApi?.canScrollNext())

  return (
    <div className={styles.embla}>
      {/* Viewport */}
      <div className={styles.emblaViewport} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {Array.from({ length: ITEMS }).map((_,index) => (
            <div key={index} className={styles.emblaSlide}>
              <Image src="/sampleforex.jpg" alt="sample screenshot" width={1000} height={500} />  
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className={styles.emblaControls}>
        <div className="grid gap-2 grid-cols-2">
          <Button onClick={scrollPrev} variant="outline" size="icon" className="rounded-full">
            <ChevronLeft />
          </Button>       
          <Button onClick={scrollNext} variant="outline" size="icon" className="rounded-full">
            <ChevronRight />
          </Button>
        </div>
        <div className="flex">
          {Array.from({ length: ITEMS }).map((_,index) => (
            <button
              key={index}
              onClick={() => onDotButtonClick(index)} 
              className={cn(styles.emblaDotButton, {
                "!border-(--color-ring)": index === selectedIndex
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

