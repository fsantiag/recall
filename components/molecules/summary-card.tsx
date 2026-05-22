'use client'

interface SummaryCardProps {
  count: number
  label: string
  tone: 'red' | 'amber' | 'orange' | 'green' | 'brand'
  onClick: () => void
}

const TONE_CLASSES: Record<SummaryCardProps['tone'], string> = {
  red:    'bg-danger-soft text-danger',
  amber:  'bg-warn-soft text-warn',
  orange: 'bg-orange-soft text-orange',
  green:  'bg-success-soft text-success',
  brand:  'bg-brand-50 text-brand',
}

export function SummaryCard({ count, label, tone, onClick }: SummaryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start rounded-[16px] p-4 w-full text-left
                  active:scale-[0.97] transition-transform ${TONE_CLASSES[tone]}`}
    >
      <span className="font-mono-rc text-[36px] font-medium leading-none">{count}</span>
      <span className="text-[13px] font-medium mt-2 leading-tight">{label}</span>
    </button>
  )
}
