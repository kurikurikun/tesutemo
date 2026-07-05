import dynamic from 'next/dynamic'

const InternalMasterContent = dynamic(() => import('./InternalMasterContent'), { ssr: false })

export default function InternalPage() {
  return <InternalMasterContent />
}
