import React, { Suspense } from "react";
import SectionCards from "@/components/SectionCards";
import SiteHeader from "@/components/SiteHeader";
import { verifyUser, checkUserRoleIsNone } from "@/lib/dal";
import YearlyRevenueChart from "@/components/charts/YearlyRevenueChart";
import ProfitLossPieChart from "@/components/charts/ProfitLossPieChart";
import MostUsedPhasesChart from "@/components/charts/MostUsedPhasesChart";
import { getMostUsedPhase, getTotalLoss, getTotalProfit } from "@/db/queries";

export default async function Dashboard() {
  await checkUserRoleIsNone();
  await verifyUser();

  const totalProfit = await getTotalProfit();
  const totalLoss = await getTotalLoss();

  const mostUsedPhase = await getMostUsedPhase();

  return (
    <>
      <SiteHeader heading="dashboard" />
      <main className="grid p-4 gap-4">
        <SectionCards />
        <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
          <Suspense fallback="Loading Chart ...">
            <ProfitLossPieChart profit={totalProfit.profit * 100} loss={Math.abs(totalLoss.loss * 100)}  />
          </Suspense>
          <Suspense fallback="Loading Chart ...">
            <MostUsedPhasesChart data={mostUsedPhase} />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <YearlyRevenueChart />
        </div>
      </main>
    </>
  );
}
