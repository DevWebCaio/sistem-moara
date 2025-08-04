import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MainLayout } from "@/components/layout/main-layout"

export default function UploadPage() {
  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upload de Dados</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Envie novos arquivos de dados para o Energy Vault.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Novo Upload</CardTitle>
            <CardDescription>Preencha os detalhes para enviar seus dados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Arquivo de Dados</Label>
              <Input id="file" type="file" />
              <p className="text-sm text-gray-500">Formatos suportados: CSV, JSON, XML.</p>
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descreva o conteúdo do arquivo..." />
            </div>
            <Button className="w-full">Enviar Dados</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
