import dynamicImport from 'next/dynamic'
import { Navigation } from '@/components/navigation'
import { PortfolioHero } from '@/components/portfolio/portfolio-hero'
import { BreadcrumbSchema } from '@/components/structured-data'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = false

// Lazy load below-the-fold components
const ProjectsGrid = dynamicImport(() =>
	import('@/components/portfolio/projects-grid').then((mod) => ({
		default: mod.ProjectsGrid,
	})),
)
const ServicesShowcase = dynamicImport(() =>
	import('@/components/portfolio/services-showcase.loader').then((mod) => ({
		default: mod.default,
	})),
)
const Testimonials = dynamicImport(() =>
	import('@/components/portfolio/testimonials.loader').then((mod) => ({
		default: mod.default,
	})),
)
const Footer = dynamicImport(() =>
	import('@/components/footer').then((mod) => ({ default: mod.Footer })),
)

const breadcrumbData = [
	{ name: 'Home', url: 'https://ystmedia.com' },
	{ name: 'Portfolio', url: 'https://ystmedia.com/portfolio' },
]

export const metadata = {
	title: 'Portfolio | YST Media - Tourism Consulting',
	description:
		'Explore our portfolio of successful tourism and hospitality consulting projects. From hotel management to digital transformation.',
}

export default function PortfolioPage() {
	return (
		<>
			<BreadcrumbSchema items={breadcrumbData} />
			<Navigation />
			<main id="main">
				<PortfolioHero />
				<ProjectsGrid />
				<ServicesShowcase />
				<Testimonials />
			</main>
			<Footer />
		</>
	)
}
