export interface InverterData {
  id: string
  plantId: string
  inverterId: string
  timestamp: string
  power: number // kW
  energy: number // kWh
  voltage: number // V
  current: number // A
  frequency: number // Hz
  temperature: number // °C
  status: 'online' | 'offline' | 'fault' | 'maintenance'
  efficiency: number // %
}

export interface PlantData {
  id: string
  name: string
  location: string
  capacity: number // kWp
  inverters: InverterData[]
  totalPower: number
  totalEnergy: number
  lastUpdate: string
}

// Simulação de dados do SOLARMAN
export const mockInverterData: InverterData[] = [
  {
    id: '1',
    plantId: 'plant_alpha',
    inverterId: 'inv_001',
    timestamp: new Date().toISOString(),
    power: 45.2,
    energy: 1250.8,
    voltage: 230.5,
    current: 196.1,
    frequency: 60.0,
    temperature: 45.2,
    status: 'online',
    efficiency: 96.8,
  },
  {
    id: '2',
    plantId: 'plant_beta',
    inverterId: 'inv_002',
    timestamp: new Date().toISOString(),
    power: 38.7,
    energy: 987.3,
    voltage: 228.9,
    current: 169.2,
    frequency: 60.0,
    temperature: 42.1,
    status: 'online',
    efficiency: 95.2,
  },
  {
    id: '3',
    plantId: 'plant_gamma',
    inverterId: 'inv_003',
    timestamp: new Date().toISOString(),
    power: 0.0,
    energy: 0.0,
    voltage: 0.0,
    current: 0.0,
    frequency: 0.0,
    temperature: 25.0,
    status: 'offline',
    efficiency: 0.0,
  },
]

export const mockPlantData: PlantData[] = [
  {
    id: 'plant_alpha',
    name: 'Usina Solar Alpha',
    location: 'Cidade do Sol, MG',
    capacity: 50.0,
    inverters: mockInverterData.filter(inv => inv.plantId === 'plant_alpha'),
    totalPower: 45.2,
    totalEnergy: 1250.8,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'plant_beta',
    name: 'Usina Solar Beta',
    location: 'Vale Verde, SP',
    capacity: 40.0,
    inverters: mockInverterData.filter(inv => inv.plantId === 'plant_beta'),
    totalPower: 38.7,
    totalEnergy: 987.3,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'plant_gamma',
    name: 'Usina Solar Gama',
    location: 'Serra Azul, BA',
    capacity: 30.0,
    inverters: mockInverterData.filter(inv => inv.plantId === 'plant_gamma'),
    totalPower: 0.0,
    totalEnergy: 0.0,
    lastUpdate: new Date().toISOString(),
  },
]

// Funções para monitoramento
export function getPlantById(plantId: string): PlantData | undefined {
  return mockPlantData.find(plant => plant.id === plantId)
}

export function getAllPlants(): PlantData[] {
  return mockPlantData
}

export function getInverterById(inverterId: string): InverterData | undefined {
  return mockInverterData.find(inverter => inverter.inverterId === inverterId)
}

export function getInvertersByPlant(plantId: string): InverterData[] {
  return mockInverterData.filter(inverter => inverter.plantId === plantId)
}

export function calculatePlantEfficiency(plantId: string): number {
  const plant = getPlantById(plantId)
  if (!plant) return 0

  const onlineInverters = plant.inverters.filter(inv => inv.status === 'online')
  if (onlineInverters.length === 0) return 0

  const totalEfficiency = onlineInverters.reduce((sum, inv) => sum + inv.efficiency, 0)
  return totalEfficiency / onlineInverters.length
}

export function getPlantStatus(plantId: string): 'online' | 'offline' | 'partial' {
  const plant = getPlantById(plantId)
  if (!plant) return 'offline'

  const onlineInverters = plant.inverters.filter(inv => inv.status === 'online')
  const totalInverters = plant.inverters.length

  if (onlineInverters.length === 0) return 'offline'
  if (onlineInverters.length === totalInverters) return 'online'
  return 'partial'
}

// Simulação de dados em tempo real
export function getRealTimeData(plantId: string): InverterData[] {
  // Simula dados em tempo real com pequenas variações
  return getInvertersByPlant(plantId).map(inverter => ({
    ...inverter,
    power: inverter.power + (Math.random() - 0.5) * 2,
    voltage: inverter.voltage + (Math.random() - 0.5) * 5,
    current: inverter.current + (Math.random() - 0.5) * 3,
    temperature: inverter.temperature + (Math.random() - 0.5) * 2,
    timestamp: new Date().toISOString(),
  }))
} 