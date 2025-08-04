import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/layout/main-layout"
import PowerPlantForm from "@/components/power-plants/power-plant-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function PowerPlantsPage() {
  const powerPlants = [
    {
      id: "PP001",
      name: "Usina Solar Alpha",
      location: "Cidade do Sol, MG",
      capacity: "1.2 MWp",
      status: "Operacional",
    },
    {
      id: "PP002",
      name: "Usina Solar Beta",
      location: "Vale Verde, SP",
      capacity: "0.8 MWp",
      status: "Em Construção",
    },
    {
      id: "PP003",
      name: "Usina Solar Gama",
      location: "Serra Azul, BA",
      capacity: "2.5 MWp",
      status: "Operacional",
    },
  ]

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Usinas Solares</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Gerencie todas as usinas solares cadastradas na plataforma.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Nova Usina
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Usina Solar</DialogTitle>
              </DialogHeader>
              <PowerPlantForm />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usinas Solares</CardTitle>
            <CardDescription>Visualize e gerencie todas as usinas cadastradas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Input placeholder="Buscar usinas..." className="max-w-sm" />
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
                    <TableHead>Localização</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {powerPlants.map((plant) => (
                    <TableRow key={plant.id}>
                      <TableCell className="font-medium">{plant.id}</TableCell>
                      <TableCell>{plant.name}</TableCell>
                      <TableCell>{plant.location}</TableCell>
                      <TableCell>{plant.capacity}</TableCell>
                      <TableCell>{plant.status}</TableCell>
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
