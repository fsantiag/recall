import { CalendarGrid } from '@/components/organisms/calendar-grid'

export default function CalendarPage() {
  return (
    <main className="max-w-2xl mx-auto pb-24">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-[28px] font-semibold tracking-tight">Calendar</h1>
      </div>
      <CalendarGrid />
    </main>
  )
}
