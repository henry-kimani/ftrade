import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 @md/main:grid-cols-2 @4xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <Description>BALANCE</Description>
          <Title>$1,000.00</Title>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <Description>TODAY'S PROFIT</Description>
          <Title>$1,000.00</Title>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <Description>WIN RATE</Description>
          <Title>$1,000.00</Title>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <Description>P&L RATIO</Description>
          <Title className="flex h-full items-end">
            <div className="flex h-5 w-full">
              <div className="basis-[30%] rounded-l-full h-full bg-green-500 grid place-items-center text-xs text-muted">
                30%
              </div>
              <div className="basis-[70%] rounded-r-full h-full bg-red-500 grid place-items-center text-xs text-muted">
                70%
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
