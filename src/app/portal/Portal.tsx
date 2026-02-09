import React, { ReactNode, useEffect, useState } from 'react'

import ReactDom from 'react-dom'

interface PortalProps {
  containerId?: string
  children: React.ReactNode
}

const Portal: React.FC<PortalProps> = ({ containerId = 'portal-root', children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const setupContainer = () => {
      let portalContainer = document.getElementById(containerId)
      if (!portalContainer) {
        portalContainer = document.createElement('div')
        portalContainer.id = containerId
        document.body.appendChild(portalContainer)
      }
      return portalContainer
    }
    const portalContainer = setupContainer()
    setContainer(portalContainer)
    return () => {
      if (portalContainer?.childNodes?.length === 0) {
        document.body.removeChild(portalContainer)
      }
    }
  }, [containerId])

  if (!container) {
    return null
  }
  return ReactDom.createPortal(children, container)
}

export default Portal
