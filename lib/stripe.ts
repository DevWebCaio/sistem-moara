import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export default stripe

// Tipos para faturamento
export interface InvoiceData {
  customerEmail: string
  customerName: string
  amount: number
  description: string
  dueDate: string
  energyCredits?: number
}

export interface PaymentIntent {
  id: string
  amount: number
  status: string
  customer_email: string
  created: number
} 