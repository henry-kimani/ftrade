import React, { Suspense } from "react";
import SectionCards from "@/components/SectionCards";
import SiteHeader from "@/components/SiteHeader";
import { verifyUser, checkUserRoleIsNone } from "@/lib/dal";
import YearlyRevenueChart from "@/components/charts/YearlyRevenueChart";
import ProfitLossPieChart from "@/components/charts/ProfitLossPieChart";
import MostUsedPhasesChart from "@/components/charts/MostUsedPhasesChart";
import ChooseYearForChartForm from "@/components/forms/ChooseYearForChartForm";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from "@/components/ui/card";
import { getAccountBalance, getMonthlyProfitForYear, getMostUsedPhase, getProfitLossRatio, getTotalLoss, getTotalProfit, getTotalProfitLossCount, getWinRate, getYearsForSelect } from "@/db/queries";

export default async function Dashboard(props: {
  searchParams?: Promise<{
    year?: string
  }>
}) {
  await checkUserRoleIsNone();
  await verifyUser();

  const searchParams = await props.searchParams;
  const searchTerm = Number(searchParams?.year) || 2022;

  const totalProfit = await getTotalProfit();
  const totalLoss = await getTotalLoss();
  const mostUsedPhase = await getMostUsedPhase();
  const accountBalance = await getAccountBalance();
  const winRate = await getWinRate();
  const profitLossRatio = await getProfitLossRatio();
  const profitLossCount = await getTotalProfitLossCount();

  const yearsForSelect = await getYearsForSelect();
  const totalMonthlyProfit = await getMonthlyProfitForYear(searchTerm);

  return (
    <>
      <SiteHeader heading="dashboard" />
      <main className="grid p-4 gap-4">
        <SectionCards 
          balance={Number((accountBalance.balance/100).toFixed(2))} 
          winRate={winRate}
          profitLossRatio={profitLossRatio}
          profitLossCount={profitLossCount}
        />
        <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
          <Suspense fallback="Loading Chart ...">
            <ProfitLossPieChart 
              profit={totalProfit.profit * 100} 
              loss={Math.abs(totalLoss.loss * 100)}  
            />
          </Suspense>
          <Suspense fallback="Loading Chart ...">
            <MostUsedPhasesChart data={mostUsedPhase} />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Yearly Revenue</CardTitle>
                <CardDescription>The total revenue for each month</CardDescription>
              </div>
              <div>
                <ChooseYearForChartForm yearsToChoose={yearsForSelect} />
              </div>
            </CardHeader>
            <CardContent>
              <YearlyRevenueChart 
                monthlyProfit={totalMonthlyProfit} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
