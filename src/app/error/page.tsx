'use client';

import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return <div className="grid place-items-center h-svh text-lg font-semibold">
    <div className="grid">
      <p>Something went wrong</p>
      <Button asChild>Try again</Button>
    </div>
  </div>
}
