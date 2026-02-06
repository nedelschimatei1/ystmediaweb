'use client'

import { useState, useMemo, memo } from 'react'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

export function ProjectsGrid() {
	const { t } = useI18n()
	const [activeCategory, setActiveCategory] = useState('all')

	const categories = useMemo(
		() => [
			{ key: 'all', label: t('portfolio.filter.all') },
			{ key: 'hoteluri', label: t('portfolio.filter.hoteluri') },
			{ key: 'restaurante', label: t('portfolio.filter.restaurante') },
			{ key: 'pensiuni-vile', label: t('portfolio.filter.pensiuniVile') },
			{ key: 'constructii', label: t('portfolio.filter.constructii') },
			{ key: 'altele', label: t('portfolio.filter.altele') },
		],
		[t],
	)

	const projects = useMemo(
		() => [
			// HOTELURI
			{
				id: 1,
				title: 'Hotel Ambasador București',
				category: 'hoteluri',
				categoryLabel: t('portfolio.filter.hoteluri'),
				description: t('portfolio.project_ambasador.desc'),
				location: t('portfolio.project_ambasador.location'),
				year: '2024',
				featured: true,
			},
			{
				id: 2,
				title: 'Hotel Restaurant Verse',
				category: 'hoteluri',
				categoryLabel: t('portfolio.filter.hoteluri'),
				description: t('portfolio.project_verse.desc'),
				location: t('portfolio.project_verse.location'),
				year: '2023',
				featured: false,
			},
			{
				id: 3,
				title: 'Hotel Puflene – Delta Dunării',
				category: 'hoteluri',
				categoryLabel: t('portfolio.filter.hoteluri'),
				description: t('portfolio.project_puflene.desc'),
				location: t('portfolio.project_puflene.location'),
				year: '2024',
				featured: false,
			},

			// RESTAURANTE
			{
				id: 4,
				title: 'Casa Românească – Otopeni',
				category: 'restaurante',
				categoryLabel: t('portfolio.filter.restaurante'),
				description: t('portfolio.project_casar_otopeni.desc'),
				location: t('portfolio.project_casar_otopeni.location'),
				year: '2023',
				featured: false,
			},
			{
				id: 5,
				title: 'Casa Românească – Ateneu',
				category: 'restaurante',
				categoryLabel: t('portfolio.filter.restaurante'),
				description: t('portfolio.project_casar_ateneu.desc'),
				location: t('portfolio.project_casar_ateneu.location'),
				year: '2023',
				featured: false,
			},
			{
				id: 6,
				title: 'Trattoria Don Vito',
				category: 'restaurante',
				categoryLabel: t('portfolio.filter.restaurante'),
				description: t('portfolio.project_donvito.desc'),
				location: t('portfolio.project_donvito.location'),
				year: '2024',
				featured: false,
			},
			{
				id: 7,
				title: 'La Cetate',
				category: 'restaurante',
				categoryLabel: t('portfolio.filter.restaurante'),
				description: t('portfolio.project_lacetate.desc'),
				location: t('portfolio.project_lacetate.location'),
				year: '2024',
				featured: false,
			},

			// PENSIUNI & VILE
			{
				id: 8,
				title: 'Vila Alisio – Sinaia',
				category: 'pensiuni-vile',
				categoryLabel: t('portfolio.filter.pensiuniVile'),
				description: t('portfolio.project_vila_alisio.desc'),
				location: t('portfolio.project_vila_alisio.location'),
				year: '2023',
				featured: false,
			},
			{
				id: 9,
				title: 'Vila Florilor – Predeal',
				category: 'pensiuni-vile',
				categoryLabel: t('portfolio.filter.pensiuniVile'),
				description: t('portfolio.project_vila_florilor.desc'),
				location: t('portfolio.project_vila_florilor.location'),
				year: '2023',
				featured: false,
			},
			{
				id: 10,
				title: 'Casa Santa Maria – Moieciu',
				category: 'pensiuni-vile',
				categoryLabel: t('portfolio.filter.pensiuniVile'),
				description: t('portfolio.project_casa_santa.desc'),
				location: t('portfolio.project_casa_santa.location'),
				year: '2022',
				featured: false,
			},

			// CONSTRUCȚII
			{
				id: 11,
				title: 'Rollart Sistem',
				category: 'constructii',
				categoryLabel: t('portfolio.filter.constructii'),
				description: t('portfolio.project_rollart.desc'),
				location: t('portfolio.project_rollart.location'),
				year: '2023',
				featured: false,
			},
			{
				id: 12,
				title: 'Bitacom',
				category: 'constructii',
				categoryLabel: t('portfolio.filter.constructii'),
				description: t('portfolio.project_bitacom.desc'),
				location: t('portfolio.project_bitacom.location'),
				year: '2023',
				featured: false,
			},
			{
				id: 13,
				title: 'Concept Happy House',
				category: 'constructii',
				categoryLabel: t('portfolio.filter.constructii'),
				description: t('portfolio.project_happyhouse.desc'),
				location: t('portfolio.project_happyhouse.location'),
				year: '2024',
				featured: false,
			},

			// ALTE PROIECTE
			{
				id: 14,
				title: 'Jeanina Crivac – Terapeut',
				category: 'altele',
				categoryLabel: t('portfolio.filter.altele'),
				description: t('portfolio.project_jeanina.desc'),
				location: t('portfolio.project_jeanina.location'),
				year: '2024',
				featured: false,
			},
			{
				id: 15,
				title: 'Calota Boxing Gym',
				category: 'altele',
				categoryLabel: t('portfolio.filter.altele'),
				description: t('portfolio.project_calota.desc'),
				location: t('portfolio.project_calota.location'),
				year: '2024',
				featured: false,
			},
		],
		[t],
	)

	const PAGE_SIZE = 6

	const categoryKeys = useMemo(
		() => categories.filter((c) => c.key !== 'all').map((c) => c.key),
		[categories],
	)

	const counts = useMemo(() => {
		const map: Record<string, number> = {} as Record<string, number>
		for (const k of categoryKeys) {
			map[k] = projects.filter((p) => p.category === k).length
		}
		return map
	}, [projects, categoryKeys])

	const [pageByCategory, setPageByCategory] = useState<Record<string, number>>(
		() => {
			const initial: Record<string, number> = {} as Record<string, number>
			categoryKeys.forEach((k) => (initial[k] = 1))
			return initial
		},
	)

	const getPaged = (categoryKey: string) => {
		const all = projects.filter((p) => p.category === categoryKey)
		const page = pageByCategory[categoryKey] || 1
		const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE))
		const start = (page - 1) * PAGE_SIZE
		return {
			items: all.slice(start, start + PAGE_SIZE),
			page,
			totalPages,
			total: all.length,
		}
	}

	const setPage = (categoryKey: string, nextPage: number) => {
		setPageByCategory((prev) => ({
			...prev,
			[categoryKey]: Math.max(1, nextPage),
		}))
	}

	const ProjectCard = memo(function ProjectCard({ project }: { project: any }) {
		return (
			<article
				className={cn(
					'group relative bg-card border border-border rounded-2xl overflow-hidden',
					'hover:border-primary/30 hover:shadow-xl transition-all duration-500',
				)}
			>
				{/* Image placeholder */}
				<div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="font-serif text-6xl font-medium text-primary/20">
							{String(project.id).padStart(2, '0')}
						</span>
					</div>

					{/* Hover overlay */}
					<div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<div className="w-12 h-12 rounded-full bg-primary-foreground flex items-center justify-center">
							<ArrowUpRightIcon className="w-5 h-5 text-primary" />
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-6">
					<div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
						<span>{project.categoryLabel}</span>
						<span className="w-1 h-1 rounded-full bg-muted-foreground" />
						<span>{project.year}</span>
					</div>

					<h3 className="font-serif text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
						{project.title}
					</h3>

					<p className="text-muted-foreground text-sm leading-relaxed mb-4">
						{project.description}
					</p>

					<div className="pt-4 border-t border-border">
						<span className="text-xs text-muted-foreground">
							{project.location}
						</span>
					</div>
				</div>
			</article>
		)
	})

	return (
		<section className="py-12 lg:py-16 bg-background">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				{/* Filter */}
				<div className="flex flex-wrap items-center gap-2 mb-8">
					{categories.map((cat) => (
						<button
							key={cat.key}
							onClick={() => setActiveCategory(cat.key)}
							aria-label={`${cat.label}${cat.key !== 'all' ? ` (${counts[cat.key] ?? 0})` : ''}`}
							className={cn(
								'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
								activeCategory === cat.key
									? 'bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground'
									: 'bg-muted text-muted-foreground hover:bg-muted/80',
							)}
						>
							<div className="flex items-center gap-2">
								<span>{cat.label}</span>
								{cat.key !== 'all' && (
									<span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground">
										{counts[cat.key] ?? 0}
									</span>
								)}
							</div>
						</button>
					))}
				</div>

				{/* Projects Grid (grouped per category or single category) */}
				{activeCategory === 'all' ? (
					<>
						{categories
							.filter((c) => c.key !== 'all')
							.map((cat) => {
								const { items, page, totalPages, total } = getPaged(cat.key)
								return (
									<section key={cat.key} className="mb-10">
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-lg font-semibold">
												{cat.label}
												<span className="ml-3 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground">
													{total}
												</span>
											</h3>
										</div>
										{items.length === 0 ? (
											<p className="text-sm text-muted-foreground">—</p>
										) : (
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{items.map((project) => (
													<ProjectCard key={project.id} project={project} />
												))}
											</div>
										)}

										<div className="flex items-center gap-2 mt-4">
											<button
												onClick={() => setPage(cat.key, page - 1)}
												disabled={page <= 1}
												className={cn(
													'px-3 py-1 rounded-md text-sm',
													page <= 1
														? 'opacity-40 cursor-not-allowed'
														: 'bg-muted hover:bg-muted/90',
												)}
											>
												{t('portfolio.pagination.prev')}
											</button>
											<span className="text-sm text-muted-foreground">
												{page} / {totalPages}
											</span>
											<button
												onClick={() => setPage(cat.key, page + 1)}
												disabled={page >= totalPages}
												className={cn(
													'px-3 py-1 rounded-md text-sm',
													page >= totalPages
														? 'opacity-40 cursor-not-allowed'
														: 'bg-muted hover:bg-muted/90',
												)}
											>
												{t('portfolio.pagination.next')}
											</button>
										</div>
									</section>
								)
							})}
					</>
				) : (
					// Single selected category
					(() => {
						const key = activeCategory
						const cat = categories.find((c) => c.key === key)
						const { items, page, totalPages, total } = getPaged(key)
						return (
							<section className="mb-10">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">
										{cat?.label}
										<span className="ml-3 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground">
											{total}
										</span>
									</h3>
								</div>
								{items.length === 0 ? (
									<p className="text-sm text-muted-foreground">—</p>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{items.map((project) => (
											<ProjectCard key={project.id} project={project} />
										))}
									</div>
								)}

								<div className="flex items-center gap-2 mt-4">
									<button
										onClick={() => setPage(key, page - 1)}
										disabled={page <= 1}
										className={cn(
											'px-3 py-1 rounded-md text-sm',
											page <= 1
												? 'opacity-40 cursor-not-allowed'
												: 'bg-muted hover:bg-muted/90',
										)}
									>
										{t('portfolio.pagination.prev')}
									</button>
									<span className="text-sm text-muted-foreground">
										{page} / {totalPages}
									</span>
									<button
										onClick={() => setPage(key, page + 1)}
										disabled={page >= totalPages}
										className={cn(
											'px-3 py-1 rounded-md text-sm',
											page >= totalPages
												? 'opacity-40 cursor-not-allowed'
												: 'bg-muted hover:bg-muted/90',
										)}
									>
										{t('portfolio.pagination.next')}
									</button>
								</div>
							</section>
						)
					})()
				)}
			</div>
		</section>
	)
}
