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
import { 
  getAccountBalance, getMonthlyProfitForYear, getMostUsedPhase, getProfitLossRatio, 
  getTotalLoss, getTotalProfit, getTotalProfitLossCount, getWinRate, getYearsForSelect 
} from "@/db/dashboard-queries";
import DashboardSelectCalendar from "@/components/forms/DashboardSelectCalendar";

export default async function Dashboard(props: {
  searchParams?: Promise<{
    year?: string;
    from?: string;
    to?: string;
  }>
}) {
  await checkUserRoleIsNone();
  await verifyUser();

  const currentDate = new Date();

  const searchParams = await props.searchParams;
  const selectYear = Number(searchParams?.year) || currentDate.getFullYear();
  const dateFrom= new Date(searchParams?.from || `${currentDate.getFullYear()}-${currentDate.getUTCMonth()}-01`);
  const dateTo = new Date(searchParams?.to || `${currentDate.getFullYear()}-${currentDate.getUTCMonth()}-30`);

  const [
    totalProfit, totalLoss, mostUsedPhase, accountBalance, winRate, profitLossRatio,
    profitLossCount, yearsForSelect, totalMonthlyProfit
  ] = await Promise.all([
    getTotalProfit({ from: dateFrom, to: dateTo }), getTotalLoss({ from: dateFrom, to: dateTo }),
    getMostUsedPhase({ from: dateFrom, to: dateTo }), getAccountBalance(),
    getWinRate({ from: dateFrom, to: dateTo }), getProfitLossRatio({ from: dateFrom, to: dateTo }),
    getTotalProfitLossCount({ from: dateFrom, to: dateTo }), getYearsForSelect(),
    getMonthlyProfitForYear(selectYear),
  ]);

  return (
    <>
      <SiteHeader heading="dashboard">
        <DashboardSelectCalendar from={dateFrom} to={dateTo} />
      </SiteHeader>
      <main className="grid p-4 gap-4">
        {(
          profitLossRatio && profitLossCount && totalLoss && totalProfit &&
            mostUsedPhase 
        ) ? 
          ( 
            <>
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
            </>
          ): (
            <section className="mb-4">
              <h3 className="text-xl font-semibold">No Data Yet</h3>
              <p className="text-muted-foreground mt-2">Try selecting an existing date range above.</p>
            </section>
          )
        }
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
