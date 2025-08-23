import { EChartsOption } from "echarts";
import Echarts from "./Echarts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function MostUsedPhasesChart() {

  const chartData = [
    { name: "Phase A", value: 200 },
    { name: "Phase B", value: 40 },
    { name: "Phase C", value: 100 },
    { name: "Phase D", value: 50 },
  ];

  const options: EChartsOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center"
    },
    series: [
      {
        name: "Phases",
        type: "pie",
        radius: [ "40%", "70%" ],
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "normal"
          }
        },
        labelLine: {
          show: false
        },
        data: chartData,
      }
    ]
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Most Used Phase</CardTitle>
          <CardDescription>A representation of the most used phase.</CardDescription>
        </CardHeader>
        <CardContent>
          <Echarts option={options} />
        </CardContent>
      </Card>
    </div>
  );
}
