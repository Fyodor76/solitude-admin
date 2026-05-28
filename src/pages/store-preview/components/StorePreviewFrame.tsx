import type { RefObject } from 'react'

type StorePreviewFrameProps = {
  iframeRef: RefObject<HTMLIFrameElement | null>
  iframeSrc: string
  iframeNonce: number
}

export function StorePreviewFrame({ iframeRef, iframeSrc, iframeNonce }: StorePreviewFrameProps) {
  return (
    <div className="storePreview__frameWrap">
      <iframe
        key={`${iframeSrc}-${iframeNonce}`}
        ref={iframeRef}
        className="storePreview__frame"
        title="Solitude Store"
        src={iframeSrc}
        sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-same-origin"
      />
    </div>
  )
}
