"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamic client-only imports (ssr: false) live inside this client component
const NewsletterWrapper = dynamic(
  () => import('./newsletter-wrapper').then(mod => ({ default: mod.NewsletterWrapper })),
  { ssr: false, loading: () => null }
)
const WhatsAppButton = dynamic(
  () => import('./whatsapp-button').then(mod => ({ default: mod.WhatsAppButton })),
  { ssr: false, loading: () => null }
)

export default function DeferredWidgets({ delay = 3000 }: { delay?: number }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  if (!show) return null

  return (
    <>
      <NewsletterWrapper />
      <WhatsAppButton />
    </>
  )
}
