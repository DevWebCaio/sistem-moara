"use client"

import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface AreaChartProps {
  data: Record<string, any>[]
  categories: string[]
  index: string
  chartConfig: ChartConfig
}

export function AreaChart({ data, categories, index, chartConfig }: AreaChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RechartsAreaChart
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
          <Area
            key={category}
            dataKey={category}
            type="monotone"
            fill={`var(--color-${category})`}
            stroke={`var(--color-${category})`}
            stackId="a"
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  )
}
