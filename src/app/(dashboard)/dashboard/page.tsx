import React from "react";
import SectionCards from "@/components/SectionCards";
import SiteHeader from "@/components/SiteHeader";
import { verifyUser, checkUserRoleIsNone } from "@/lib/dal";
import YearlyRevenueChart from "@/components/charts/YearlyRevenueChart";
import ProfitLossPieChart from "@/components/charts/ProfitLossPieChart";
import MostUsedPhasesChart from "@/components/charts/MostUsedPhasesChart";

export default async function Dashboard() {
  await checkUserRoleIsNone();
  await verifyUser();

  return (
    <>
      <SiteHeader heading="dashboard" />
      <main className="grid p-4 gap-4">
        <SectionCards />
        <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
          <ProfitLossPieChart />
          <MostUsedPhasesChart />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <YearlyRevenueChart />
        </div>
      </main>
    </>
  );
}
