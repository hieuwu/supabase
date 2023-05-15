import { SidePanel } from 'ui'

export interface PITRSidePanelProps {
  visible: boolean
  onClose: () => void
}

const PITRSidePanel = ({ visible, onClose }: PITRSidePanelProps) => {
  return (
    <SidePanel visible={visible} onCancel={onClose}>
      PITR
    </SidePanel>
  )
}

export default PITRSidePanel
