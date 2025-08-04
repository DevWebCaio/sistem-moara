import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { InvoiceData } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body: InvoiceData = await request.json()
    const { customerEmail, customerName, amount, description, dueDate, energyCredits } = body

    // Criar customer no Stripe
    const customer = await stripe.customers.create({
      email: customerEmail,
      name: customerName,
      metadata: {
        energyCredits: energyCredits?.toString() || '0',
        dueDate,
      },
    })

    // Criar invoice no Stripe
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      description: `${description} - Créditos Energéticos: ${energyCredits || 0} kWh`,
      due_date: Math.floor(new Date(dueDate).getTime() / 1000),
      metadata: {
        energyCredits: energyCredits?.toString() || '0',
        dueDate,
      },
    })

    // Adicionar item à invoice
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: amount * 100, // Stripe usa centavos
      currency: 'brl',
      description: description,
    })

    // Finalizar invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)

    // Enviar invoice por email
    await stripe.invoices.sendInvoice(finalizedInvoice.id)

    return NextResponse.json({
      success: true,
      invoiceId: finalizedInvoice.id,
      customerId: customer.id,
      message: 'Fatura criada e enviada com sucesso',
    })
  } catch (error) {
    console.error('Erro ao criar fatura:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar fatura' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('email')

    if (!customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Email do cliente é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar invoices do cliente
    const invoices = await stripe.invoices.list({
      limit: 100,
    })

    const customerInvoices = invoices.data.filter(
      (invoice) => invoice.customer_email === customerEmail
    )

    return NextResponse.json({
      success: true,
      invoices: customerInvoices.map((invoice) => ({
        id: invoice.id,
        amount: invoice.amount_paid / 100,
        status: invoice.status,
        dueDate: invoice.due_date,
        description: invoice.description,
        energyCredits: invoice.metadata.energyCredits,
      })),
    })
  } catch (error) {
    console.error('Erro ao buscar faturas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar faturas' },
      { status: 500 }
    )
  }
} 