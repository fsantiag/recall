import { ProcedureList } from '@/components/organisms/procedure-list'

export default function AllProceduresPage() {
  return (
    <main className="container mx-auto px-4 pt-14 pb-6 max-w-2xl">
      <h1 className="text-[28px] font-semibold tracking-tight mb-6">All procedures</h1>
      <ProcedureList />
    </main>
  )
}
