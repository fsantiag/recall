import { ResumoDetailScreen } from '@/components/organisms/resumo-detail-screen'

export default async function ResumoDetailPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  return <ResumoDetailScreen category={category} />
}
