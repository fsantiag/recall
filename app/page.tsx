import { PendingAlert } from '@/components/organisms/pending-alert'
import { ProcedureList } from '@/components/organisms/procedure-list'

export default function DashboardPage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Recall</h1>
      <PendingAlert />
      <ProcedureList />
    </main>
  )
}
