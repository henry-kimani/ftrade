import TradingView from "@/components/TradingView";

export default function TradingViewPage() {
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

