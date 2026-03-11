import React, { ReactNode, useEffect, useState } from 'react'

import ReactDom from 'react-dom'

interface PortalProps {
  containerId?: string
  children: ReactNode
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
      if (portalContainer && document.body.contains(portalContainer)) {
        requestAnimationFrame(() => {
          // Проверяем после того как React удалил детей
          if (portalContainer && portalContainer.childNodes.length === 0) {
            if (document.body.contains(portalContainer)) {
              document.body.removeChild(portalContainer)
            }
          }
        })
      }
    }
  }, [containerId])

  if (!container) {
    return null
  }
  return ReactDom.createPortal(children, container)
}

export default Portal
