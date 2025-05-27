
import React from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from "@/components/ui/card";

export default function OverallRevenueChart() {
  return (
    <section>
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle>Overall Revenue</CardTitle>
          <CardDescription>A bar chart representation of the total profit and loss</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </section>
  );
}
