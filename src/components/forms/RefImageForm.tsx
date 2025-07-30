'use client';

import { Input } from "@/components/ui/input";
import { uploadRefImageAction } from "@/lib/actions";
import { useRef } from "react";

export default function RefImageForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={uploadRefImageAction}>
      <Input 
        placeholder="F"
        name="reference-image" 
        type="file"
        onChange={() => formRef?.current?.requestSubmit()}
      />
    </form>
  );
}
