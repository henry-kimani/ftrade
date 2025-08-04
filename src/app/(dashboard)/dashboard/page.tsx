import React from "react";
import SectionCards from "@/components/SectionCards";
import OverallRevenueChart from "@/components/charts/OverallRevenueChart";
import SiteHeader from "@/components/SiteHeader";
import { verifyUser, checkUserRoleIsNone } from "@/lib/dal";

export default async function Dashboard() {
  await checkUserRoleIsNone();
  await verifyUser();

  return (
    <>
      <div><SiteHeader heading="dashboard" /></div>
      <main className="grid p-4 gap-4">
        <SectionCards />
        <div className="grid grid-cols-1 gap-4 @2xl/main:grid-cols-2">
          <OverallRevenueChart />
          <OverallRevenueChart />
        </div>
      </main>
    </>
  );
}
