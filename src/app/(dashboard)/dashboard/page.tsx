import React from "react";
import SectionCards from "@/components/SectionCards";
import OverallRevenueChart from "@/components/charts/OverallRevenueChart";
import SiteHeader from "@/components/SiteHeader";
import { verifyUser } from "@/lib/dal";

export default async function Dashboard() {
  await verifyUser();

  return (
    <>
      <div><SiteHeader heading="dashboard" /></div>
      <main className="grid p-4 gap-4">
        <SectionCards />
        <OverallRevenueChart />
      </main>
    </>
  );
}
