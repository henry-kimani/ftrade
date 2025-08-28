import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SectionCards({
  balance, winRate, profitLossRatio, profitLossCount
}: {
    balance: number,
    winRate: number,
    profitLossRatio: number[],
    profitLossCount: {
      profit: number;
      loss: number;
    }
  }) {

  return (
    <div className="grid grid-cols-1 gap-4 @md/main:grid-cols-2 @4xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <Description>BALANCE</Description>
          <Title>${balance}</Title>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <Description>WIN RATE</Description>
          {/* win / total * 100 */}
          <Title>{winRate}%</Title>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <Description>P & L RATIO</Description>
          <Title>{profitLossRatio[0]}:{profitLossRatio[1]}</Title>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <Description>PROFIT & LOSS</Description>
          <Title className="flex h-full items-end">
            <div className="flex h-5 w-full">
              <div 
                // Into a percentage
                style={{ flexBasis: profitLossCount.profit/(profitLossCount.profit + profitLossCount.loss) * 100 + "%" }} 
                className="rounded-l-full h-full bg-green-500 grid place-items-center text-xs text-muted"
              >
                {profitLossCount.profit}
              </div>
              <div 
                style={{ flexBasis: profitLossCount.loss/(profitLossCount.profit + profitLossCount.loss) * 100 + "%" }} 
                className="basis-[30%] rounded-r-full h-full bg-red-500 grid place-items-center text-xs text-muted"
              >
                {profitLossCount.loss}
              </div>
            </div>
          </Title>
        </CardHeader>
      </Card>
    </div>
  );
}

function Title({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <CardTitle className={`@[250px]/card:text-3xl text-2xl font-semibold tabular-nums mt-3 ${className}`}>
      { children }
    </CardTitle>
  );
}

function Description({ children }: { children: React.ReactNode }) {
  return (
    <CardDescription className="font-bold text-xs">
      {children}
    </CardDescription>
  );
}
