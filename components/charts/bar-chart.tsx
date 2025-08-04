"use client"

import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BarChartProps {
  data: Record<string, any>[]
  categories: string[]
  index: string
  chartConfig: ChartConfig
}

export function BarChart({ data, categories, index, chartConfig }: BarChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RechartsBarChart
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
          <Bar key={category} dataKey={category} fill={`var(--color-${category})`} radius={4} />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  )
}
