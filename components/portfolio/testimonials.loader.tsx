'use client'

import dynamic from 'next/dynamic'
import { useInView } from '@/hooks/use-in-view'
import { useState, useEffect } from 'react'

const Testimonials = dynamic(
	() => import('./testimonials').then((m) => m.Testimonials),
	{ ssr: false },
)

export default function TestimonialsLoader() {
	const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: true })
	const [load, setLoad] = useState(false)

	useEffect(() => {
		if (isInView) setLoad(true)
	}, [isInView])

	return (
		<div ref={ref}>
			{load ? (
				<Testimonials />
			) : (
				<div className="py-12 lg:py-16 bg-background">
					<div className="max-w-7xl mx-auto px-6 lg:px-8">
						<div className="h-40 bg-card border border-border rounded-xl" />
					</div>
				</div>
			)}
		</div>
	)
}
