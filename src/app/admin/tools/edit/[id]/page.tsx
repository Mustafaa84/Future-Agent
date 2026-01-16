import ToolForm from '../../ToolForm'

export default async function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ToolForm mode="edit" toolId={id} />
}
