import dynamic from 'next/dynamic'

const AdminContent = dynamic(() => import('./AdminContent'), { ssr: false })

export default function AdminPage({ params }: { params: { clientId: string } }) {
  return <AdminContent clientId={params.clientId} />
}
