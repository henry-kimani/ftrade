import AddNewTradingPlan from "@/components/tradingplan/AddNewTradingPlans";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ModifyTradingStrategies from "@/components/tradingplan/ModifyTradingStrategies";

export default async function TradingPlans() {

  return (
    <div>
      <div>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Trading Plans</CardTitle>
              <CardDescription>
                These are all the existing Trading Plans.
              </CardDescription>
            </div>
            <div>
              <CreateDialog />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ModifyTradingStrategies />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function CreateDialog() {

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
        <AddNewTradingPlan />
      </DialogContent>
    </Dialog>
  );
}
