import React from "react";
import SectionCards from "@/components/SectionCards";
import OverallRevenueChart from "@/components/charts/OverallRevenueChart";

export default function Dashboard() {
  return (
    <main className="grid p-4 gap-4">
      <SectionCards />
      <OverallRevenueChart />
    </main>
  );
}
