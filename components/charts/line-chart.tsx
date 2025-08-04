"use client"

import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface LineChartProps {
  data: Record<string, any>[]
  categories: string[]
  index: string
  chartConfig: ChartConfig
}

export function LineChart({ data, categories, index, chartConfig }: LineChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RechartsLineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}`} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        {categories.map((category) => (
          <Line
            key={category}
            dataKey={category}
            type="monotone"
            stroke={`var(--color-${category})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  )
}
