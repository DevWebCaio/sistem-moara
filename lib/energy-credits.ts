export interface EnergyCredit {
  id: string
  customerEmail: string
  customerName: string
  credits: number
  generatedAt: string
  consumedAt?: string
  status: 'active' | 'consumed' | 'expired'
  source: 'solar_generation' | 'purchase' | 'compensation'
  invoiceId?: string
}

export interface EnergyVault {
  id: string
  customerEmail: string
  totalCredits: number
  availableCredits: number
  consumedCredits: number
  lastUpdated: string
  transactions: EnergyTransaction[]
}

export interface EnergyTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  timestamp: string
  invoiceId?: string
}

// Simulação de dados de créditos energéticos
export const mockEnergyCredits: EnergyCredit[] = [
  {
    id: '1',
    customerEmail: 'joao.silva@email.com',
    customerName: 'João Silva',
    credits: 150.5,
    generatedAt: '2024-01-15T10:00:00Z',
    status: 'active',
    source: 'solar_generation',
  },
  {
    id: '2',
    customerEmail: 'maria.souza@email.com',
    customerName: 'Maria Souza',
    credits: 89.2,
    generatedAt: '2024-01-14T14:30:00Z',
    status: 'active',
    source: 'solar_generation',
  },
  {
    id: '3',
    customerEmail: 'carlos.lima@email.com',
    customerName: 'Carlos Lima',
    credits: 200.0,
    generatedAt: '2024-01-13T09:15:00Z',
    consumedAt: '2024-01-15T16:45:00Z',
    status: 'consumed',
    source: 'solar_generation',
    invoiceId: 'inv_123456',
  },
]

export const mockEnergyVaults: EnergyVault[] = [
  {
    id: '1',
    customerEmail: 'joao.silva@email.com',
    totalCredits: 450.5,
    availableCredits: 150.5,
    consumedCredits: 300.0,
    lastUpdated: '2024-01-15T10:00:00Z',
    transactions: [
      {
        id: '1',
        type: 'credit',
        amount: 150.5,
        description: 'Geração solar - Usina Alpha',
        timestamp: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        type: 'debit',
        amount: 50.0,
        description: 'Consumo residencial',
        timestamp: '2024-01-14T18:00:00Z',
        invoiceId: 'inv_123456',
      },
    ],
  },
  {
    id: '2',
    customerEmail: 'maria.souza@email.com',
    totalCredits: 289.2,
    availableCredits: 89.2,
    consumedCredits: 200.0,
    lastUpdated: '2024-01-14T14:30:00Z',
    transactions: [
      {
        id: '3',
        type: 'credit',
        amount: 89.2,
        description: 'Geração solar - Usina Beta',
        timestamp: '2024-01-14T14:30:00Z',
      },
    ],
  },
]

// Funções para gerenciar créditos energéticos
export function getEnergyVaultByEmail(email: string): EnergyVault | undefined {
  return mockEnergyVaults.find(vault => vault.customerEmail === email)
}

export function getEnergyCreditsByEmail(email: string): EnergyCredit[] {
  return mockEnergyCredits.filter(credit => credit.customerEmail === email)
}

export function calculateTotalCredits(email: string): number {
  const credits = getEnergyCreditsByEmail(email)
  return credits.reduce((total, credit) => {
    if (credit.status === 'active') {
      return total + credit.credits
    }
    return total
  }, 0)
}

export function addEnergyCredits(
  email: string,
  amount: number,
  source: 'solar_generation' | 'purchase' | 'compensation',
  description: string
): EnergyCredit {
  const newCredit: EnergyCredit = {
    id: Date.now().toString(),
    customerEmail: email,
    customerName: 'Cliente', // Seria buscado do banco
    credits: amount,
    generatedAt: new Date().toISOString(),
    status: 'active',
    source,
  }

  mockEnergyCredits.push(newCredit)
  return newCredit
} 