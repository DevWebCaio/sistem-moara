import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Gerencie as configurações gerais da sua plataforma.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>Atualize as informações básicas da plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-md items-center gap-1.5">
              <Label htmlFor="platform-name">Nome da Plataforma</Label>
              <Input id="platform-name" defaultValue="Solar DG Platform" />
            </div>
            <div className="grid w-full max-w-md items-center gap-1.5">
              <Label htmlFor="admin-email">Email do Administrador</Label>
              <Input id="admin-email" type="email" defaultValue="admin@solardg.com" />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">Descrição da Plataforma</Label>
              <Textarea id="description" defaultValue="Plataforma de gestão para energia solar distribuída." />
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure suas preferências de notificação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Notificações por Email</Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">Notificações por SMS</Label>
              <Switch id="sms-notifications" />
            </div>
            <Button>Atualizar Preferências</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
