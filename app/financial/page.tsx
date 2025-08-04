import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

export default function FinancialPage() {
  const transactions = [
    {
      id: "TRN001",
      date: "2023-07-01",
      description: "Faturamento Usina Alpha",
      type: "Receita",
      amount: "R$ 15.000,00",
    },
    { id: "TRN002", date: "2023-07-05", description: "Manutenção Preventiva", type: "Despesa", amount: "R$ 2.500,00" },
    { id: "TRN003", date: "2023-07-10", description: "Faturamento Usina Beta", type: "Receita", amount: "R$ 8.000,00" },
    { id: "TRN004", date: "2023-07-12", description: "Pagamento de Salários", type: "Despesa", amount: "R$ 10.000,00" },
  ]

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestão Financeira</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Acompanhe todas as transações financeiras da sua operação.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Nova Transação
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Extrato de Transações</CardTitle>
            <CardDescription>Visualize todas as entradas e saídas financeiras.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Input placeholder="Buscar transações..." className="max-w-sm" />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell className="text-right">{transaction.amount}</TableCell>
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
