import { SidePanel } from 'ui'

export interface ComputeInstanceSidePanelProps {
  visible: boolean
  onClose: () => void
}

const ComputeInstanceSidePanel = ({ visible, onClose }: ComputeInstanceSidePanelProps) => {
  return (
    <SidePanel visible={visible} onCancel={onClose}>
      Compute Instance
    </SidePanel>
  )
}

export default ComputeInstanceSidePanel
