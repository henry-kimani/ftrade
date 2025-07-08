import ModifyTradingPlansForm from "@/components/forms/ModifyTradingPlansForm";
import SiteHeader from "@/components/SiteHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { getTradingPlanAndStrategiesWithIds } from "@/db/queries";
import { toGroupedStrategiesWithIds } from "@/lib/utils";
import Link from "next/link";

export default async function EditTradingPlan(
  props: { params: Promise<{ id: string }>}
) {
  const { id: tradingPlanId } = await props.params;

  // Data to prefill the form
  const tradingPlanAndStrategiesWithIds = await getTradingPlanAndStrategiesWithIds(tradingPlanId);

  return (
    <div>
      <SiteHeader heading="EDIT TRADING PLAN" />
      <div className="max-w-full w-3xl m-auto p-4">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList className="text-lg">
              <BreadcrumbItem>
                <Link className="transition-colors hover:text-foreground" href="/settings">Settings</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <ModifyTradingPlansForm 
            defaultTradingPlanStrategies={toGroupedStrategiesWithIds(tradingPlanAndStrategiesWithIds)} 
          />
        </div>
      </div>
    </div>
  );
}
