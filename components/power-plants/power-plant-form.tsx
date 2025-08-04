"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { LoadingButton } from "@/components/ui/loading-button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  location: z.string().min(2, {
    message: "A localização deve ter pelo menos 2 caracteres.",
  }),
  capacity: z.string().regex(/^\d+(\.\d+)?\s*MWp$/, {
    message: "A capacidade deve estar no formato 'X.X MWp' (ex: '1.5 MWp').",
  }),
  status: z.enum(["Operacional", "Em Construção", "Desativada"]),
  description: z.string().optional(),
})

export default function PowerPlantForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      capacity: "",
      status: "Operacional",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log(values)
      toast({
        title: "Usina Cadastrada!",
        description: `A usina "${values.name}" foi cadastrada com sucesso.`,
        variant: "success",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Erro ao cadastrar usina. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Usina</FormLabel>
              <FormControl>
                <Input placeholder="Usina Solar Exemplo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localização</FormLabel>
              <FormControl>
                <Input placeholder="Cidade, Estado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidade (MWp)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 1.5 MWp" {...field} />
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
                  <SelectItem value="Operacional">Operacional</SelectItem>
                  <SelectItem value="Em Construção">Em Construção</SelectItem>
                  <SelectItem value="Desativada">Desativada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes adicionais sobre a usina..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" className="w-full" loading={isLoading}>
          Cadastrar Usina
        </LoadingButton>
      </form>
    </Form>
  )
}
