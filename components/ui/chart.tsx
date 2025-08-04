"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Tooltip,
  type TooltipProps,
  CartesianGrid,
  Line,
  Bar,
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

const ChartContext = React.createContext<
  {
    config: ChartConfig
  } & (
    | {
        data: ChartData
        /**
         * @deprecated Use `value` instead.
         */
        category?: string
        value?: number
      }
    | { data?: undefined; category?: undefined; value?: undefined }
  )
>(null as any)

type ChartConfig = {
  [k: string]: {
    label?: string
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: string } | { color?: string; theme?: string })
}

type ChartData = Record<string, any>[]

function ChartContainer<TData extends ChartData = ChartData>({
  config,
  children,
  className,
  data,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  data?: TData
}) {
  const uniqueId = React.useId()
  const id = `chart-${uniqueId}`
  return (
    <ChartContext.Provider value={{ config, data: data as ChartData }}>
      <div data-chart={id} className={cn("flex aspect-video justify-center text-foreground", className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

const ChartTooltip = ({
  cursor,
  content,
  className,
  ...props
}: TooltipProps<any, any> & React.ComponentPropsWithoutRef<typeof Tooltip>) => {
  const { config } = useChart()

  const customTooltip = React.useCallback(
    ({ active, payload, label }: TooltipProps<any, any>) => {
      if (active && payload && payload.length) {
        return (
          <div className={cn("rounded-lg border bg-background p-2 text-sm shadow-md", className)}>
            <div className="grid gap-1.5">
              {label ? <p className="font-medium text-muted-foreground">{label}</p> : null}
              {payload.map((item, i) => {
                const { stroke, fill, value, name } = item
                const color = config[item.dataKey as keyof typeof config]?.color || stroke || fill
                return (
                  <div key={item.dataKey} className="flex items-center gap-2">
                    {color && (
                      <span
                        className="flex h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: color,
                        }}
                      />
                    )}
                    {name && config[name as keyof typeof config]?.label ? (
                      <p className="text-muted-foreground">{config[name as keyof typeof config].label}</p>
                    ) : null}
                    <p className="font-medium">{value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }

      return null
    },
    [className, config],
  )

  return <Tooltip cursor={cursor} content={customTooltip} className={className} {...props} />
}

type ChartTooltipContentProps = React.ComponentPropsWithoutRef<"div"> & {
  hideLabel?: boolean
  hideIndicator?: boolean
  nameKey?: string
  valueKey?: string
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ className, hideLabel = false, hideIndicator = false, nameKey, valueKey, ...props }, ref) => {
    const { config } = useChart()

    return (
      <div
        ref={ref}
        className={cn("grid gap-1.5 rounded-lg border bg-background px-2 py-1.5 text-xs shadow-xl", className)}
        {...props}
      >
        {!hideLabel ? (
          <div className="font-medium text-muted-foreground" data-chart-tooltip-label>
            {/* Placeholder for label content */}
          </div>
        ) : null}
        <ul className="grid gap-1.5">{/* Placeholder for payload mapping */}</ul>
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  const { config } = useChart()

  return (
    <div className={cn("flex items-center justify-center gap-4", className)} {...props}>
      {Object.entries(config).map(([key, item]) => (
        <div key={key} className="flex items-center gap-1.5">
          <span
            className="flex h-3 w-3 rounded-full"
            style={{
              backgroundColor: item.color,
            }}
          />
          <p className="text-sm text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

const ChartPrimitive = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return <Comp ref={ref} className={cn("w-full h-full", className)} {...props} />
})
ChartPrimitive.displayName = "ChartPrimitive"

const useChart = () => {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer")
  }
  return context
}

const ChartCrosshair = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  return <div className={cn("absolute inset-0 pointer-events-none", className)} {...props} />
}

const ChartRadialBar = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadialBar>) => {
  const { config } = useChart()
  return (
    <RadialBar
      className={cn("stroke-current", className)}
      fill={config[props.dataKey as keyof typeof config]?.color}
      {...props}
    />
  )
}

const ChartPolarGrid = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof PolarGrid>) => {
  return <PolarGrid className={cn("stroke-border", className)} {...props} />
}

const ChartPolarAngleAxis = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof PolarAngleAxis>) => {
  return <PolarAngleAxis className={cn("fill-muted-foreground", className)} {...props} />
}

const ChartPolarRadiusAxis = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof PolarRadiusAxis>) => {
  return <PolarRadiusAxis className={cn("fill-muted-foreground", className)} {...props} />
}

const ChartRadialBarChart = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadialBarChart>) => {
  return <RadialBarChart className={cn("w-full h-full", className)} {...props} />
}

const ChartLine = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof Line>) => {
  const { config } = useChart()
  return (
    <Line
      className={cn("stroke-current", className)}
      stroke={config[props.dataKey as keyof typeof config]?.color}
      {...props}
    />
  )
}

const ChartBar = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof Bar>) => {
  const { config } = useChart()
  return (
    <Bar
      className={cn("fill-current", className)}
      fill={config[props.dataKey as keyof typeof config]?.color}
      {...props}
    />
  )
}

const ChartArea = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof Area>) => {
  const { config } = useChart()
  return (
    <Area
      className={cn("fill-current", className)}
      fill={config[props.dataKey as keyof typeof config]?.color}
      {...props}
    />
  )
}

const ChartXAxis = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof XAxis>) => {
  return <XAxis className={cn("text-muted-foreground", className)} {...props} />
}

const ChartYAxis = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof YAxis>) => {
  return <YAxis className={cn("text-muted-foreground", className)} {...props} />
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartPrimitive,
  useChart,
  ChartCrosshair,
  ChartRadialBar,
  ChartPolarGrid,
  ChartPolarAngleAxis,
  ChartPolarRadiusAxis,
  ChartRadialBarChart,
  RechartsLineChart,
  RechartsBarChart,
  RechartsAreaChart,
  CartesianGrid,
  Line,
  Bar,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
}
