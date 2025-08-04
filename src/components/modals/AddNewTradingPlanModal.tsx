import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddNewTradingPlanModal({ children }: { children: React.ReactNode }) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary">
          New
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Trading Plan</DialogTitle>
          <DialogDescription>
            Add a new tradingplan and their strategies.
          </DialogDescription>
        </DialogHeader>
        { children }
      </DialogContent>
    </Dialog>
  );
}
