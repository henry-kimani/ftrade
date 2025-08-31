'use client';

import { Input } from "@/components/ui/input";
import { uploadRefImageAction } from "@/lib/actions/ref-image";
import { ImageUpIcon } from "lucide-react";
import { useRef } from "react";
import { Label } from "@/components/ui/label";

export default function RefImageForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form className="relative" ref={formRef} action={uploadRefImageAction}>
      <Label htmlFor="ref-image" className="bg-muted rounded-md p-1.5 absolute z-10 top-1/2 left-1/2 -translate-1/2">
        <ImageUpIcon />
      </Label>
      <Input
        id="ref-image"
        className="w-10 opacity-0"
        placeholder="F"
        name="reference-image" 
        type="file"
        accept="image/png"
        onChange={() => formRef?.current?.requestSubmit()}
      />
    </form>
  );
}
