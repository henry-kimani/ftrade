import AddNewTradingPlan from "@/components/tradingplan/AddNewTradingPlans";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ModifyTradingStrategies from "@/components/tradingplan/ModifyTradingStrategies";
import AddNewTradingPlanModal from "../modals/AddNewTradingPlanModal";
import { isCurrentUserAdmin } from "@/lib/dal";

export default async function TradingPlans() {

  const isAdmin = await isCurrentUserAdmin();

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
              {isAdmin &&
                <AddNewTradingPlanModal>
                  <AddNewTradingPlan />
                </AddNewTradingPlanModal>
              }
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
