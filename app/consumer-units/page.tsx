import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/layout/main-layout"

export default function ConsumerUnitsPage() {
  const consumerUnits = [
    {
      id: "CU001",
      name: "Residência Silva",
      address: "Rua A, 123",
      city: "São Paulo",
      status: "Ativa",
    },
    {
      id: "CU002",
      name: "Comércio Central",
      address: "Av. B, 456",
      city: "Rio de Janeiro",
      status: "Ativa",
    },
    {
      id: "CU003",
      name: "Indústria Alfa",
      address: "Rod. C, 789",
      city: "Belo Horizonte",
      status: "Inativa",
    },
  ]

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Unidades Consumidoras</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Gerencie as unidades consumidoras conectadas às suas usinas.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Nova Unidade
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Unidades Consumidoras</CardTitle>
            <CardDescription>Visualize e gerencie todas as unidades consumidoras.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Input placeholder="Buscar unidades..." className="max-w-sm" />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consumerUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.id}</TableCell>
                      <TableCell>{unit.name}</TableCell>
                      <TableCell>{unit.address}</TableCell>
                      <TableCell>{unit.city}</TableCell>
                      <TableCell>{unit.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
