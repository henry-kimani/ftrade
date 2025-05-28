import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Metrics() {
  return (
    <div className="p-0 m-0">
      <div className="grid gap-1.5 mb-4">
        <Label className="text-lg font-semibold">Metrics</Label>
        <p className="text-muted-foreground text-sm">
          Useful metrics for this trade
        </p>
      </div>
      <div className="grid @sm/main:grid-cols-2 @sm/main:gap-8">
        <div>
          <MetricContainer field="Profit" record={20} />
          <MetricContainer field="Exit" record={1335} />
          <MetricContainer field="Entry" record={1534} />
        </div>
        <div>
          <MetricContainer field="Balance" record={20} />
          <MetricContainer field="Lot Size" record={20} />
          <MetricContainer field="Ratio" record={20} />
        </div>
      </div>
    </div>
  );
}

function MetricContainer({ field, record }: { field: string, record: number }) {
  return (
    <div className="grid grid-flow-col pb-1">
      <Metric>{field}</Metric>
      <Metric className="text-end font-semibold">{record}</Metric>
    </div>
  );
}

function Metric({ children, className }: { children: React.ReactNode, className?: string }) {
  return(
    <p className={cn("text-start", className )}>{children}</p>
  );
}
