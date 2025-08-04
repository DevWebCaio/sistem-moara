import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

export default function CRMPage() {
  const clients = [
    { id: "CLI001", name: "João Silva", email: "joao.silva@example.com", phone: "(11) 98765-4321", status: "Ativo" },
    { id: "CLI002", name: "Maria Souza", email: "maria.souza@example.com", phone: "(21) 91234-5678", status: "Ativo" },
    {
      id: "CLI003",
      name: "Carlos Lima",
      email: "carlos.lima@example.com",
      phone: "(31) 99887-6655",
      status: "Inativo",
    },
    { id: "CLI004", name: "Ana Paula", email: "ana.paula@example.com", phone: "(41) 97766-5544", status: "Ativo" },
  ]

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestão de Clientes (CRM)</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Gerencie seus clientes, leads e interações.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo Cliente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Visualize e gerencie todos os seus clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Input placeholder="Buscar clientes..." className="max-w-sm" />
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
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.status}</TableCell>
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
