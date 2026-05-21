'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addProcedure, updateProcedure } from '@/lib/procedures'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const schema = z.object({
  name: z.string().min(1, 'Procedure name is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  payer: z.string().min(1, 'Payer is required'),
  date: z.string().min(1, 'Date is required'),
  reminderDays: z.string().refine(
    (v) => {
      const n = parseInt(v, 10)
      return !isNaN(n) && n >= 1
    },
    { message: 'Must be at least 1 day' }
  ),
})

type FormValues = z.infer<typeof schema>

interface ProcedureFormProps {
  defaultValues?: {
    name?: string
    patientName?: string
    payer?: string
    date?: string
    reminderDays?: number
  }
  procedureId?: string
  onSuccess: () => void
}

export function ProcedureForm({ defaultValues, procedureId, onSuccess }: ProcedureFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      patientName: defaultValues?.patientName ?? '',
      payer: defaultValues?.payer ?? '',
      date: defaultValues?.date ?? '',
      reminderDays: String(defaultValues?.reminderDays ?? 30),
    },
  })

  async function onSubmit(values: FormValues) {
    const reminderDays = parseInt(values.reminderDays, 10)
    const payload = { ...values, reminderDays }
    if (procedureId) {
      await updateProcedure(procedureId, payload)
    } else {
      await addProcedure({ ...payload, status: 'pending' })
    }
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedure Name</FormLabel>
              <FormControl><Input placeholder="e.g. Consultation" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payer</FormLabel>
              <FormControl><Input placeholder="e.g. Unimed" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reminderDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Days</FormLabel>
              <FormControl><Input type="number" min={1} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  )
}
