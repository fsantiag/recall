export const NOTIF_PREF_KEY = 'recall_notifications'

export function notificationsEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(NOTIF_PREF_KEY) === 'true'
}

export function setNotificationsEnabled(v: boolean): void {
  localStorage.setItem(NOTIF_PREF_KEY, String(v))
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function fireSummaryNotification(total: number, body: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  if (!notificationsEnabled()) return
  if (total === 0) return
  new Notification('Recall', { body, tag: 'recall-summary', icon: '/icon-192.png' })
}
