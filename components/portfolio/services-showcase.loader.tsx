'use client'

import dynamic from 'next/dynamic'
import { useInView } from '@/hooks/use-in-view'
import { useState, useEffect } from 'react'

const ServicesShowcase = dynamic(
	() => import('./services-showcase').then((m) => m.ServicesShowcase),
	{ ssr: false },
)

export default function ServicesShowcaseLoader() {
	const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: true })
	const [load, setLoad] = useState(false)

	useEffect(() => {
		if (isInView) setLoad(true)
	}, [isInView])

	return (
		<div ref={ref}>
			{load ? (
				<ServicesShowcase />
			) : (
				<div className="py-12 lg:py-16 bg-muted">
					<div className="max-w-7xl mx-auto px-6 lg:px-8">
						<div className="h-48 bg-card border border-border rounded-xl" />
					</div>
				</div>
			)}
		</div>
	)
}
