import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Zap, Users2, FileText } from "lucide-react"
import { LineChart } from "@/components/charts/line-chart"
import type { ChartConfig } from "@/components/ui/chart"
import { StatsCard } from "@/components/ui/stats-card"

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Visão geral e métricas importantes da sua plataforma.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Receita Total" value="R$ 2.350.000" description="+20.1% do mês passado" icon={DollarSign} />
          <StatsCard title="Produção de Energia (MWh)" value="1.500" description="+15% do mês passado" icon={Zap} />
          <StatsCard title="Clientes Ativos" value="1.200" description="+5% do mês passado" icon={Users2} />
          <StatsCard title="Contratos Ativos" value="350" description="+8% do mês passado" icon={FileText} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Produção de Energia Mensal</CardTitle>
            <CardDescription>Produção de energia ao longo dos últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={chartData} categories={["desktop", "mobile"]} index="month" chartConfig={chartConfig} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usinas por Status</CardTitle>
              <CardDescription>Distribuição das usinas por status operacional.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for a pie chart or similar visualization */}
              <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md text-gray-500">
                Gráfico de Usinas por Status
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unidades Consumidoras por Região</CardTitle>
              <CardDescription>Distribuição das unidades consumidoras por região.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for a bar chart or map visualization */}
              <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md text-gray-500">
                Gráfico de Unidades por Região
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
