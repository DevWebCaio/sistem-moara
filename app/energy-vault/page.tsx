"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  getEnergyVaultByEmail,
  getEnergyCreditsByEmail,
  calculateTotalCredits,
  addEnergyCredits,
  type EnergyVault,
  type EnergyCredit,
  type EnergyTransaction
} from "@/lib/energy-credits"
import { useState, useEffect } from "react"
import { Zap, Plus, Minus, TrendingUp, Clock, User, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EnergyVaultPage() {
  const [selectedEmail, setSelectedEmail] = useState("joao.silva@email.com")
  const [energyVault, setEnergyVault] = useState<EnergyVault | undefined>()
  const [energyCredits, setEnergyCredits] = useState<EnergyCredit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadEnergyData()
  }, [selectedEmail])

  const loadEnergyData = () => {
    const vault = getEnergyVaultByEmail(selectedEmail)
    const credits = getEnergyCreditsByEmail(selectedEmail)
    
    setEnergyVault(vault)
    setEnergyCredits(credits)
  }

  const handleAddCredits = async () => {
    setIsLoading(true)
    
    try {
      // Simular adição de créditos
      const newCredit = addEnergyCredits(
        selectedEmail,
        50.0,
        'solar_generation',
        'Geração solar - Usina Alpha'
      )
      
      toast({
        title: "Créditos adicionados!",
        description: `50 kWh foram adicionados ao cofre energético.`,
      })
      
      loadEnergyData()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar créditos energéticos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalCredits = calculateTotalCredits(selectedEmail)
  const activeCredits = energyCredits.filter(credit => credit.status === 'active')
  const consumedCredits = energyCredits.filter(credit => credit.status === 'consumed')

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cofre Energético</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Gestão de créditos energéticos dos clientes e unidades consumidoras.
            </p>
          </div>
        </div>

        {/* Seleção de Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Cliente</CardTitle>
            <CardDescription>Escolha um cliente para gerenciar seus créditos energéticos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Email do Cliente</label>
                <select
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="joao.silva@email.com">João Silva - joao.silva@email.com</option>
                  <option value="maria.souza@email.com">Maria Souza - maria.souza@email.com</option>
                  <option value="carlos.lima@email.com">Carlos Lima - carlos.lima@email.com</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddCredits} disabled={isLoading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Créditos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo do Cofre */}
        {energyVault && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Resumo do Cofre Energético
              </CardTitle>
              <CardDescription>
                Dados atualizados em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Total de Créditos</p>
                    <p className="text-2xl font-bold">{energyVault.totalCredits.toFixed(1)} kWh</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Créditos Disponíveis</p>
                    <p className="text-2xl font-bold">{energyVault.availableCredits.toFixed(1)} kWh</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Minus className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Créditos Consumidos</p>
                    <p className="text-2xl font-bold">{energyVault.consumedCredits.toFixed(1)} kWh</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Última Atualização</p>
                    <p className="text-sm">{new Date(energyVault.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar de Utilização */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Utilização dos Créditos</span>
                  <span>{((energyVault.consumedCredits / energyVault.totalCredits) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(energyVault.consumedCredits / energyVault.totalCredits) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Créditos Ativos */}
        <Card>
          <CardHeader>
            <CardTitle>Créditos Energéticos Ativos</CardTitle>
            <CardDescription>Créditos disponíveis para consumo</CardDescription>
          </CardHeader>
          <CardContent>
            {activeCredits.length > 0 ? (
              <div className="space-y-4">
                {activeCredits.map((credit) => (
                  <Card key={credit.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Zap className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-semibold">{credit.customerName}</p>
                            <p className="text-sm text-gray-600">{credit.customerEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{credit.credits.toFixed(1)} kWh</p>
                          <p className="text-sm text-gray-600">
                            Gerado em {new Date(credit.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="secondary" className="capitalize">
                          {credit.source.replace('_', ' ')}
                        </Badge>
                        <Badge className="bg-green-500">
                          {credit.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum crédito ativo encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Transações */}
        {energyVault && energyVault.transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>Movimentações do cofre energético</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {energyVault.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {transaction.type === 'credit' ? (
                        <Plus className="h-4 w-4 text-green-500" />
                      ) : (
                        <Minus className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(1)} kWh
                      </p>
                      {transaction.invoiceId && (
                        <p className="text-xs text-gray-500">Fatura: {transaction.invoiceId}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
