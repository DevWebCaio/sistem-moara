"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  getAllPlants, 
  getPlantById, 
  getRealTimeData, 
  calculatePlantEfficiency,
  getPlantStatus,
  type PlantData,
  type InverterData 
} from "@/lib/solarman"
import { useEffect, useState } from "react"
import { Zap, Activity, Thermometer, Gauge, Clock, MapPin } from "lucide-react"

export default function MonitoringPage() {
  const [plants, setPlants] = useState<PlantData[]>([])
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null)
  const [realTimeData, setRealTimeData] = useState<InverterData[]>([])

  useEffect(() => {
    // Carregar dados das usinas
    setPlants(getAllPlants())
    
    // Atualizar dados em tempo real a cada 5 segundos
    const interval = setInterval(() => {
      if (selectedPlant) {
        setRealTimeData(getRealTimeData(selectedPlant))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedPlant])

  const currentPlant = selectedPlant ? getPlantById(selectedPlant) : null
  const plantStatus = selectedPlant ? getPlantStatus(selectedPlant) : 'offline'
  const efficiency = selectedPlant ? calculatePlantEfficiency(selectedPlant) : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-red-500'
      case 'partial': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      case 'partial': return 'Parcial'
      default: return 'Desconhecido'
    }
  }

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Monitoramento SOLARMAN</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Monitoramento em tempo real dos inversores das usinas solares.
            </p>
          </div>
        </div>

        {/* Seleção de Usina */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Usina</CardTitle>
            <CardDescription>Escolha uma usina para monitorar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plants.map((plant) => (
                <Card
                  key={plant.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPlant === plant.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPlant(plant.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{plant.name}</h3>
                      <Badge 
                        className={getStatusColor(getPlantStatus(plant.id))}
                        variant="secondary"
                      >
                        {getStatusText(getPlantStatus(plant.id))}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {plant.location}
                    </div>
                    <div className="text-sm text-gray-600">
                      Capacidade: {plant.capacity} kWp
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dados da Usina Selecionada */}
        {currentPlant && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {currentPlant.name}
                </CardTitle>
                <CardDescription>
                  Dados em tempo real - Última atualização: {new Date().toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Potência Atual</p>
                      <p className="text-2xl font-bold">{currentPlant.totalPower.toFixed(1)} kW</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Energia Total</p>
                      <p className="text-2xl font-bold">{currentPlant.totalEnergy.toFixed(1)} kWh</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">Eficiência</p>
                      <p className="text-2xl font-bold">{efficiency.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge className={getStatusColor(plantStatus)} variant="secondary">
                        {getStatusText(plantStatus)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Progress Bar de Capacidade */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Utilização da Capacidade</span>
                    <span>{((currentPlant.totalPower / currentPlant.capacity) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={(currentPlant.totalPower / currentPlant.capacity) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dados dos Inversores */}
            <Card>
              <CardHeader>
                <CardTitle>Inversores</CardTitle>
                <CardDescription>Dados detalhados dos inversores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {realTimeData.map((inverter) => (
                    <Card key={inverter.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Inversor {inverter.inverterId}</CardTitle>
                          <Badge 
                            className={getStatusColor(inverter.status)}
                            variant="secondary"
                          >
                            {inverter.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Potência</p>
                            <p className="text-xl font-bold">{inverter.power.toFixed(1)} kW</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Energia</p>
                            <p className="text-xl font-bold">{inverter.energy.toFixed(1)} kWh</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tensão</p>
                            <p className="text-xl font-bold">{inverter.voltage.toFixed(1)} V</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Corrente</p>
                            <p className="text-xl font-bold">{inverter.current.toFixed(1)} A</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Frequência</p>
                            <p className="text-xl font-bold">{inverter.frequency.toFixed(1)} Hz</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Temperatura</p>
                            <div className="flex items-center">
                              <Thermometer className="h-4 w-4 mr-1" />
                              <span className="text-xl font-bold">{inverter.temperature.toFixed(1)}°C</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Eficiência do Inversor */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Eficiência</span>
                            <span>{inverter.efficiency.toFixed(1)}%</span>
                          </div>
                          <Progress value={inverter.efficiency} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  )
} 