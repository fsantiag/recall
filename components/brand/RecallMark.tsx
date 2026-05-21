interface RecallMarkProps {
  size?: number
  color?: string
  accent?: string
}

export function RecallMark({
  size = 48,
  color = 'var(--rc-brand)',
  accent = 'var(--rc-sage-deep)',
}: RecallMarkProps) {
  const c = size / 2
  const r = size * 0.36
  const sw = size * 0.10
  const C = 2 * Math.PI * r
  const seg = (C / 4) * 0.78
  const gap = (C / 4) * 0.22
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      <circle
        cx={c} cy={c} r={r}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${seg} ${gap}`}
      />
      <circle cx={c} cy={c - r} r={size * 0.075} fill={accent} />
    </svg>
  )
}
