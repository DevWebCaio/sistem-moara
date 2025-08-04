import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Code } from "lucide-react"

export default function TestPage() {
  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Testar Dados do Energy Vault</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Execute testes e visualize a estrutura dos dados armazenados.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Executar Teste</CardTitle>
            <CardDescription>Selecione um arquivo e um tipo de teste para executar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="data-file">Arquivo de Dados</Label>
              <Select>
                <SelectTrigger id="data-file">
                  <SelectValue placeholder="Selecione um arquivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file1">Produção Usina A - Jan 2023</SelectItem>
                  <SelectItem value="file2">Consumo Residência B - Fev 2023</SelectItem>
                  <SelectItem value="file3">Dados Meteorológicos - Mar 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="test-type">Tipo de Teste</Label>
              <Select>
                <SelectTrigger id="test-type">
                  <SelectValue placeholder="Selecione o tipo de teste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schema">Validação de Esquema</SelectItem>
                  <SelectItem value="integrity">Verificação de Integridade</SelectItem>
                  <SelectItem value="performance">Teste de Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Code className="mr-2 h-4 w-4" />
              Executar Teste
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados do Teste</CardTitle>
            <CardDescription>Visualize a saída do teste e a estrutura dos dados.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              value={`// Exemplo de saída do teste
{
  "status": "success",
  "message": "Validação de esquema concluída com sucesso.",
  "details": {
    "schema_version": "1.0",
    "data_records": 1500,
    "errors": []
  },
  "data_sample": {
    "record_1": { "date": "2023-01-01", "value": 1500.5, "unit": "kWh" },
    "record_2": { "date": "2023-01-02", "value": 1480.2, "unit": "kWh" }
  }
}`}
              className="min-h-[300px] font-mono"
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
