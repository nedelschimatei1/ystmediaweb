'use client'

import { useI18n } from '@/lib/i18n'

export function PortfolioHero() {
	const { t } = useI18n()

	const stats = [
		{ value: '250+', label: t('portfolio.stats.businesses') },
		{ value: '115', label: t('portfolio.stats.collaborators') },
		{ value: '600', label: t('portfolio.stats.turnkey') },
		{ value: '40+', label: t('portfolio.stats.experience') },
	]

	return (
		<section
			className="relative pt-28 pb-12 lg:pt-32 lg:pb-16 overflow-hidden"
			data-critical-hero
		>
			{/* Critical inline CSS to render hero above-the-fold without waiting for full CSS */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
        [data-critical-hero]{padding-top:7rem;padding-bottom:3rem}
        [data-critical-hero] h1{font-size:2rem;line-height:1.05;margin:0}
        @media (min-width:640px){[data-critical-hero] h1{font-size:2.5rem}}
        @media (min-width:1024px){[data-critical-hero] h1{font-size:3.75rem}}
      `,
				}}
			/>
			{/* Background */}
			<div className="absolute inset-0 bg-gradient-to-b from-muted to-background" />

			<div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
				<div className="max-w-3xl">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
						{t('portfolio.hero.label')}
					</div>

					{/* Headline */}
					<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.1]">
						{t('portfolio.hero.title')}
					</h1>

					{/* Subtitle */}
					<p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
						{t('portfolio.hero.desc')}
					</p>
				</div>

				{/* Stats row */}
				<div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border">
					{stats.map((stat) => (
						<div key={stat.label}>
							<span className="block font-serif text-2xl lg:text-3xl font-semibold text-primary">
								{stat.value}
							</span>
							<span className="block mt-1 text-xs text-muted-foreground">
								{stat.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
