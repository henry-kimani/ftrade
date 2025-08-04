import TradingView from "@/components/TradingView";
import { checkUserRoleIsNone } from "@/lib/dal";

export default async function TradingViewPage() {
  await checkUserRoleIsNone();

  const databaseIndicators = [
    "STD;Aroon",
    "STD;Awesome_Oscillator"
  ];

  return (
    <div className="grid">
      <TradingView databaseIndicators={databaseIndicators} />
    </div>
  );
}

