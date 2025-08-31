'use client';

import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import ImageEditor from "@uppy/image-editor";
import Xhr from "@uppy/xhr-upload";
import { useEffect, useRef } from "react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";
import { Button } from "@/components/ui/button";
import { ImageUpIcon } from "lucide-react";

export default function ScreenshotUploader({ tradeId}: { tradeId: string }) {

  const ref = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if(ref && uploadRef) {
      const uppy = new Uppy();

      uppy
        .use(Xhr, { 
          endpoint: "/api/upload",
          formData: true,
          fieldName: "screenshots"
        })
        .use(Dashboard, {
          inline: false,
          // @ts-expect-error yet to figure out, though it works
          target: ref.current,
          trigger: uploadRef.current
        })
        .use(ImageEditor)
        .setMeta({ tradeId: tradeId })
    }
  }, [tradeId]);

  return (
    <section>
      <div>
        <Button
          title="Upload photo"
          size="icon"
          variant="outline"
          ref={uploadRef}
        ><ImageUpIcon /></Button>
      </div>
      <div ref={ref}>
      </div>
    </section>
  );
}
