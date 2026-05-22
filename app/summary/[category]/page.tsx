import { SummaryDetailScreen } from '@/components/organisms/summary-detail-screen'

export default async function SummaryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ payer?: string }>
}) {
  const { category } = await params
  const { payer } = await searchParams
  return <SummaryDetailScreen category={category} initialPayer={payer ?? null} />
}
