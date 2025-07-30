import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function AddPhasesModal({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"secondary"}><Plus /></Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Phases</DialogTitle>
            <DialogDescription>Add or remove phases with their color.</DialogDescription>
          </DialogHeader>
          <div>
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
