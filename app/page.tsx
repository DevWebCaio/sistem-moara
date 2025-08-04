import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart, DollarSign, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bem-vindo à Plataforma Solar DG</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Seu portal completo para gerenciar usinas solares, unidades consumidoras e finanças.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usinas Solares</CardTitle>
              <Zap className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-gray-500">Usinas ativas</p>
              <Link
                href="/power-plants"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Ver Usinas
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades Consumidoras</CardTitle>
              <BarChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50</div>
              <p className="text-xs text-gray-500">Unidades conectadas</p>
              <Link
                href="/consumer-units"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Ver Unidades
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 125.000</div>
              <p className="text-xs text-gray-500">+10% do mês passado</p>
              <Link
                href="/financial"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Ver Finanças
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visão Geral Rápida</CardTitle>
            <CardDescription>Acompanhe os principais indicadores da sua operação.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Produção de Energia</h3>
                <p className="text-gray-600">Total gerado este mês: 500 MWh</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Economia dos Clientes</h3>
                <p className="text-gray-600">Economia média por cliente: R$ 250/mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
