import { SidePanel } from 'ui'

export interface CustomDomainSidePanelProps {
  visible: boolean
  onClose: () => void
}

const CustomDomainSidePanel = ({ visible, onClose }: CustomDomainSidePanelProps) => {
  return (
    <SidePanel visible={visible} onCancel={onClose}>
      Custom Domain
    </SidePanel>
  )
}

export default CustomDomainSidePanel
