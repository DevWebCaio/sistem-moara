import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function EnergyVaultPage() {
  const dataEntries = [
    {
      id: "EV001",
      name: "Produção Usina A - Jan 2023",
      type: "Produção Mensal",
      date: "2023-01-31",
      size: "1.2 MB",
    },
    {
      id: "EV002",
      name: "Consumo Residência B - Fev 2023",
      type: "Consumo Diário",
      date: "2023-02-28",
      size: "0.8 MB",
    },
    {
      id: "EV003",
      name: "Dados Meteorológicos - Mar 2023",
      type: "Dados Climáticos",
      date: "2023-03-15",
      size: "2.5 MB",
    },
  ]

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Energy Vault</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Armazene e gerencie todos os dados relacionados à energia.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/energy-vault/upload">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Upload
              </Button>
            </Link>
            <Link href="/energy-vault/test">
              <Button variant="outline">Testar Dados</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados Armazenados</CardTitle>
            <CardDescription>Visualize e gerencie os arquivos de dados no Energy Vault.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Input placeholder="Buscar dados..." className="max-w-sm" />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome do Arquivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.id}</TableCell>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.type}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.size}</TableCell>
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
