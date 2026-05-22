import { ResumoDetailScreen } from '@/components/organisms/resumo-detail-screen'

export default async function ResumoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ payer?: string }>
}) {
  const { category } = await params
  const { payer } = await searchParams
  return <ResumoDetailScreen category={category} initialPayer={payer ?? null} />
}
