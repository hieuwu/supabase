import { SidePanel } from 'ui'

export interface TierUpdateSidePanelProps {
  visible: boolean
  onClose: () => void
}

const TierUpdateSidePanel = ({ visible, onClose }: TierUpdateSidePanelProps) => {
  return (
    <SidePanel visible={visible} onCancel={onClose}>
      Tier Update
    </SidePanel>
  )
}

export default TierUpdateSidePanel
