import SiteHeader from "@/components/SiteHeader";
import AllowedUsers from "@/components/tables/AllowedUsers";
import TradingPlans from "@/components/tradingplan/TradingPlans";

export default async function SettingsPage() {

  return (
    <div>
      <div>
        <SiteHeader heading="Settings" />
      </div>
      <main className="max-w-3xl m-auto p-4 grid gap-4">
        <div>
          <AllowedUsers />
        </div>
        <div>
          <TradingPlans />
        </div>
      </main>
    </div>
  );
}
