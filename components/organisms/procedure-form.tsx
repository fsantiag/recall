'use client'
import { useState } from 'react'
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
  reminderDays: number
}

interface ProcedureFormProps {
  defaultValues?: Partial<FormValues>
  procedureId?: string
  onSuccess: () => void
}

const DAY_PRESETS = [3, 7, 14, 30, 60, 90]

function toDateInputValue(procedureDateStr: string, days: number): string {
  const d = new Date(procedureDateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function minDateInputValue(procedureDateStr: string): string {
  const d = new Date(procedureDateStr)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function DayChip({ n, active, onClick }: { n: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[13px] font-mono-rc font-medium border transition-colors
        ${active
          ? 'bg-primary text-primary-foreground border-transparent'
          : 'bg-surface-alt text-foreground border-border'}`}
    >
      {n}d
    </button>
  )
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 px-5 pb-5">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`flex-1 h-[3px] rounded-full ${n <= step ? 'bg-primary' : 'bg-border'}`}
        />
      ))}
      <span className="font-mono-rc text-[11px] text-ink-muted ml-1">{step} / 3</span>
    </div>
  )
}

export function ProcedureForm({ defaultValues, procedureId, onSuccess }: ProcedureFormProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)

  const schema = z.object({
    name:         z.string().min(1, t('procedureNameRequired')),
    patientName:  z.string().min(1, t('patientNameRequired')),
    payer:        z.string().min(1, t('payerRequired')),
    date:         z.string().min(1, t('dateRequired')),
    reminderDays: z.number().min(1, t('reminderMinDays')),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:         defaultValues?.name ?? '',
      patientName:  defaultValues?.patientName ?? '',
      payer:        defaultValues?.payer ?? '',
      date:         defaultValues?.date ??
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      reminderDays: defaultValues?.reminderDays ?? 7,
    },
  })

  const reminderDays = form.watch('reminderDays')
  const date = form.watch('date')
  const [customMode, setCustomMode] = useState(
    () => !DAY_PRESETS.includes(defaultValues?.reminderDays ?? 7)
  )

  const reminderDate = (() => {
    if (!date) return ''
    const d = new Date(date)
    d.setDate(d.getDate() + (reminderDays || 0))
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  })()

  async function onSubmit(values: FormValues) {
    try {
      if (procedureId) {
        await updateProcedure(procedureId, values)
      } else {
        await addProcedure({ ...values, status: 'pending' })
      }
      onSuccess()
    } catch {
      form.setError('root', { message: t('saveFailed') })
    }
  }

  async function goToStep2() {
    const ok = await form.trigger('patientName')
    if (ok) setStep(2)
  }

  async function goToStep3() {
    const ok = await form.trigger(['name', 'payer', 'date', 'reminderDays'])
    if (ok) setStep(3)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ProgressBar step={step} />

        {step === 1 && (
          <div className="px-5 space-y-5">
            <h2 className="text-[22px] font-semibold tracking-tight">{t('stepPatient')}</h2>
            <FormField control={form.control} name="patientName" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fieldPatientName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholderPatientName')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="button" className="w-full" size="lg" onClick={goToStep2}>
              {t('save')} →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="px-5 space-y-5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[15px] text-ink-muted font-medium"
            >
              ← Back
            </button>
            <h2 className="text-[22px] font-semibold tracking-tight">{t('stepDetails')}</h2>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fieldProcedureName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholderProcedureName')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="payer" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fieldPayer')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholderPayer')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fieldDateTime')}</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div>
              <p className="text-[12px] font-medium uppercase tracking-widest text-ink-muted mb-3">
                {t('remindInLabel')}
              </p>
              <div className="rounded-[14px] border bg-card p-4 space-y-4">
                <div className="flex items-baseline justify-center gap-2.5">
                  <span className="font-mono-rc text-[56px] font-medium text-primary leading-none tracking-tighter">
                    {reminderDays}
                  </span>
                  <span className="text-[18px] text-ink-muted">{t('daysLabel')}</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {DAY_PRESETS.map((n) => (
                    <DayChip
                      key={n} n={n} active={!customMode && reminderDays === n}
                      onClick={() => { setCustomMode(false); form.setValue('reminderDays', n) }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomMode(true)}
                    className={`px-3 py-1.5 rounded-full text-[13px] font-mono-rc font-medium border transition-colors
                      ${customMode
                        ? 'bg-primary text-primary-foreground border-transparent'
                        : 'bg-surface-alt text-foreground border-border'}`}
                  >
                    {t('customLabel')}
                  </button>
                </div>
                {customMode && (
                  <div className="pt-2">
                    <label htmlFor="custom-reminder-date" className="sr-only">{t('reminderDateLabel')}</label>
                    <input
                      id="custom-reminder-date"
                      type="date"
                      min={date ? minDateInputValue(date) : undefined}
                      value={date ? toDateInputValue(date, reminderDays) : ''}
                      onChange={(e) => {
                        if (!e.target.value || !date) return
                        const picked = new Date(e.target.value)
                        const base = new Date(date)
                        const days = Math.max(1, Math.round((picked.getTime() - base.getTime()) / 86400000))
                        form.setValue('reminderDays', days, { shouldValidate: true })
                      }}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-[13px] text-ink-muted">{t('reminderDateLabel')}</span>
                  <span className="font-mono-rc text-[13px] font-medium">{reminderDate}</span>
                </div>
              </div>
            </div>

            <Button type="button" className="w-full" size="lg" onClick={goToStep3}>
              {t('save')} →
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="px-5 space-y-5">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-[15px] text-ink-muted font-medium"
            >
              ← Back
            </button>
            <h2 className="text-[22px] font-semibold tracking-tight">{t('reviewTitle')}</h2>
            <div className="rounded-[14px] border bg-card divide-y">
              {([
                [t('fieldPatientName'), form.getValues('patientName'), false],
                [t('fieldProcedureName'), form.getValues('name'), false],
                [t('fieldPayer'), form.getValues('payer'), false],
                [t('fieldDateTime'), form.getValues('date'), true],
                [t('fieldReminderDays'), `${reminderDays}d · ${reminderDate}`, true],
              ] as [string, string, boolean][]).map(([label, value, mono]) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[13px] text-ink-muted">{label}</span>
                  <span className={`text-[14px] ${mono ? 'font-mono-rc' : 'font-medium'}`}>{value}</span>
                </div>
              ))}
            </div>
            {form.formState.errors.root && (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? t('saving') : t('save')}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
