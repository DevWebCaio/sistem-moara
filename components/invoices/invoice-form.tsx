"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { calculateTotalCredits } from "@/lib/energy-credits"

const invoiceFormSchema = z.object({
  clientName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  clientEmail: z.string().email("Email inválido"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  energyCredits: z.number().min(0, "Créditos energéticos devem ser maior ou igual a zero"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  status: z.enum(["pending", "paid", "overdue", "cancelled"]),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

interface InvoiceFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function InvoiceForm({ onSuccess, onCancel }: InvoiceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      amount: 0,
      energyCredits: 0,
      dueDate: "",
      status: "pending",
      description: "",
    },
  })

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsLoading(true)

    try {
      // Simular chamada para API do Stripe
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: data.clientName,
          customerEmail: data.clientEmail,
          amount: data.amount,
          description: data.description,
          dueDate: data.dueDate,
          energyCredits: data.energyCredits,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao processar fatura")
      }

      const result = await response.json()

      toast({
        title: "Fatura criada com sucesso!",
        description: `Fatura ${result.invoiceId} foi enviada para ${data.clientEmail}`,
      })

      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao criar fatura:", error)
      toast({
        title: "Erro ao criar fatura",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (email: string) => {
    form.setValue("clientEmail", email)
    // Buscar créditos energéticos do cliente
    const credits = calculateTotalCredits(email)
    form.setValue("energyCredits", credits)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="João Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email do Cliente</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="joao@email.com" 
                    {...field}
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Créditos energéticos serão calculados automaticamente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Créditos Energéticos (kWh)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Créditos disponíveis no cofre energético
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Vencimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="overdue">Vencido</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição detalhada da fatura, incluindo serviços e créditos energéticos..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Inclua detalhes sobre os serviços prestados e créditos energéticos utilizados
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <LoadingButton type="submit" loading={isLoading}>
            Gerar Fatura
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
} 