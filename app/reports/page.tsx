import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"

export default function ReportsPage() {
  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Gere e visualize relatórios detalhados sobre sua operação.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerar Novo Relatório</CardTitle>
            <CardDescription>Selecione o tipo de relatório e o período.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="report-type">Tipo de Relatório</Label>
              <Select>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Produção de Energia</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="clients">Clientes</SelectItem>
                  <SelectItem value="plants">Usinas Solares</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="time-period">Período</Label>
              <Select>
                <SelectTrigger id="time-period">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
            <CardDescription>Acesse os relatórios gerados recentemente.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium">Relatório de Produção - Julho 2023</p>
                  <p className="text-sm text-gray-500">Gerado em: 2023-08-01</p>
                </div>
                <Button variant="outline" size="sm">
                  Visualizar
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium">Relatório Financeiro - Q2 2023</p>
                  <p className="text-sm text-gray-500">Gerado em: 2023-07-10</p>
                </div>
                <Button variant="outline" size="sm">
                  Visualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
