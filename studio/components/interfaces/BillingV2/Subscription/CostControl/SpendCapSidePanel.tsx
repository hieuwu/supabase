import { useParams } from 'common'
import { useProjectAddonsQuery } from 'data/subscriptions/project-addons-query'
import { SidePanel } from 'ui'

export interface SpendCapSidePanelProps {
  visible: boolean
  onClose: () => void
}

const SpendCapSidePanel = ({ visible, onClose }: SpendCapSidePanelProps) => {
  const { ref: projectRef } = useParams()

  return (
    <SidePanel size="xlarge" visible={visible} onCancel={onClose}>
      Spend Cap
    </SidePanel>
  )
}

export default SpendCapSidePanel
