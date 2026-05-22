export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  const ms = style === 'light' ? 8 : style === 'medium' ? 15 : 25
  navigator.vibrate(ms)
}
