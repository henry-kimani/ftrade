'use client';

import { Dialog, DialogTitle, DialogTrigger, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

export default function RefImageModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline"><ImageIcon /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Reference Image</DialogTitle>
        <DialogDescription>A reference image for the phases.</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
