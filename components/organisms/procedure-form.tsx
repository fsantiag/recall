'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addProcedure, updateProcedure } from '@/lib/procedures'
import { useTranslation } from '@/components/organisms/language-provider'
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

type FormValues = {
  name: string
  patientName: string
  payer: string
  date: string
  reminderDays: string
}

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
  const { t } = useTranslation()

  const schema = z.object({
    name: z.string().min(1, t('procedureNameRequired')),
    patientName: z.string().min(1, t('patientNameRequired')),
    payer: z.string().min(1, t('payerRequired')),
    date: z.string().min(1, t('dateRequired')),
    reminderDays: z.string().refine(
      (v) => { const n = parseInt(v, 10); return !isNaN(n) && n >= 1 },
      { message: t('reminderMinDays') }
    ),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      patientName: defaultValues?.patientName ?? '',
      payer: defaultValues?.payer ?? '',
      date: defaultValues?.date ?? new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      reminderDays: String(defaultValues?.reminderDays ?? 30),
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const reminderDays = parseInt(values.reminderDays, 10)
      const payload = { ...values, reminderDays }
      if (procedureId) {
        await updateProcedure(procedureId, payload)
      } else {
        await addProcedure({ ...payload, status: 'pending' })
      }
      onSuccess()
    } catch {
      form.setError('root', { message: t('saveFailed') })
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
              <FormLabel>{t('fieldProcedureName')}</FormLabel>
              <FormControl><Input placeholder={t('placeholderProcedureName')} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fieldPatientName')}</FormLabel>
              <FormControl><Input placeholder={t('placeholderPatientName')} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fieldPayer')}</FormLabel>
              <FormControl><Input placeholder={t('placeholderPayer')} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fieldDateTime')}</FormLabel>
              <FormControl><Input type="datetime-local" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reminderDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fieldReminderDays')}</FormLabel>
              <FormControl><Input type="number" min={1} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t('saving') : t('save')}
        </Button>
      </form>
    </Form>
  )
}
