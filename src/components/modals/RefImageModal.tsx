'use client';

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

export default function RefImageModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline"><ImageIcon /></Button>
      </DialogTrigger>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}
