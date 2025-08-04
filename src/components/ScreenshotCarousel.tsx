'use client';

import React, { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import styles from "@/styles/ScreenshotCarousel.module.css";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ScreenshotUploader from "@/components/forms/uppy/ScreenshotUploader";
import DeleteScreenshot from "./forms/DeleteScreenshot";

export default function ScreenshotCarousel(
  { tradeId, screenshots, isAdmin }:
  {
    tradeId: string,
    screenshots: ({
      screenshotId: string;
      screenshotPublicUrl: string;
      screenshotPath: string;
    }| undefined)[],
    isAdmin: boolean
  }
) {

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

  return (
    <div className={styles.embla}>
      {/* Viewport */}
      <div className={styles.emblaViewport} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {screenshots.map((shot, index) => (
            shot && <div key={index} className={styles.emblaSlide}>
              <Image 
                src={shot?.screenshotPublicUrl} 
                alt="sample screenshot" width={500} height={100} 
                className="w-full"
              />
              { isAdmin && <DeleteScreenshot screenshotId={shot.screenshotId} screenshotPath={shot.screenshotPath} /> }
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className={styles.emblaControls}>
        { screenshots[0]?.screenshotId && <div className="justify-self-start flex gap-2">
          <Button onClick={scrollPrev} variant="outline" size="icon" className="rounded-full">
            <ChevronLeft />
          </Button>       
          <Button onClick={scrollNext} variant="outline" size="icon" className="rounded-full">
            <ChevronRight />
          </Button>
        </div>}
        <div className="justify-self-center">
          { isAdmin && <ScreenshotUploader tradeId={tradeId} /> }
        </div>
        <div className="justify-self-end items-center flex">
          {Array.from({ length: screenshots.length }).map((_,index) => (
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

