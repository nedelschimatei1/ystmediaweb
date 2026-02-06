import Image from 'next/image'
import Script from 'next/script'
import { cn } from '@/lib/utils'
import { portfolioTranslations } from '@/lib/translations/portfolio'

export function ProjectsGrid() {
	const PAGE_SIZE = 6

	const categories = [
		{ key: 'all', label: portfolioTranslations['portfolio.filter.all'].ro },
		{
			key: 'hoteluri',
			label: portfolioTranslations['portfolio.filter.hoteluri'].ro,
		},
		{
			key: 'restaurante',
			label: portfolioTranslations['portfolio.filter.restaurante'].ro,
		},
		{
			key: 'pensiuni-vile',
			label: portfolioTranslations['portfolio.filter.pensiuniVile'].ro,
		},
		{
			key: 'constructii',
			label: portfolioTranslations['portfolio.filter.constructii'].ro,
		},
		{
			key: 'altele',
			label: portfolioTranslations['portfolio.filter.altele'].ro,
		},
	]

	const projects = [
		{
			id: 1,
			title: 'Hotel Ambasador București',
			category: 'hoteluri',
			categoryLabel: portfolioTranslations['portfolio.filter.hoteluri'].ro,
			description: portfolioTranslations['portfolio.project_ambasador.desc'].ro,
			location:
				portfolioTranslations['portfolio.project_ambasador.location'].ro,
			year: '2024',
		},
		{
			id: 2,
			title: 'Hotel Restaurant Verse',
			category: 'hoteluri',
			categoryLabel: portfolioTranslations['portfolio.filter.hoteluri'].ro,
			description: portfolioTranslations['portfolio.project_verse.desc'].ro,
			location: portfolioTranslations['portfolio.project_verse.location'].ro,
			year: '2023',
		},
		{
			id: 3,
			title: 'Hotel Puflene – Delta Dunării',
			category: 'hoteluri',
			categoryLabel: portfolioTranslations['portfolio.filter.hoteluri'].ro,
			description: portfolioTranslations['portfolio.project_puflene.desc'].ro,
			location: portfolioTranslations['portfolio.project_puflene.location'].ro,
			year: '2024',
		},
		{
			id: 4,
			title: 'Casa Românească – Otopeni',
			category: 'restaurante',
			categoryLabel: portfolioTranslations['portfolio.filter.restaurante'].ro,
			description:
				portfolioTranslations['portfolio.project_casar_otopeni.desc'].ro,
			location:
				portfolioTranslations['portfolio.project_casar_otopeni.location'].ro,
			year: '2023',
		},
		{
			id: 5,
			title: 'Casa Românească – Ateneu',
			category: 'restaurante',
			categoryLabel: portfolioTranslations['portfolio.filter.restaurante'].ro,
			description:
				portfolioTranslations['portfolio.project_casar_ateneu.desc'].ro,
			location:
				portfolioTranslations['portfolio.project_casar_ateneu.location'].ro,
			year: '2023',
		},
		{
			id: 6,
			title: 'Trattoria Don Vito',
			category: 'restaurante',
			categoryLabel: portfolioTranslations['portfolio.filter.restaurante'].ro,
			description: portfolioTranslations['portfolio.project_donvito.desc'].ro,
			location: portfolioTranslations['portfolio.project_donvito.location'].ro,
			year: '2024',
		},
		{
			id: 7,
			title: 'La Cetate',
			category: 'restaurante',
			categoryLabel: portfolioTranslations['portfolio.filter.restaurante'].ro,
			description: portfolioTranslations['portfolio.project_lacetate.desc'].ro,
			location: portfolioTranslations['portfolio.project_lacetate.location'].ro,
			year: '2024',
		},
		{
			id: 8,
			title: 'Vila Alisio – Sinaia',
			category: 'pensiuni-vile',
			categoryLabel: portfolioTranslations['portfolio.filter.pensiuniVile'].ro,
			description:
				portfolioTranslations['portfolio.project_vila_alisio.desc'].ro,
			location:
				portfolioTranslations['portfolio.project_vila_alisio.location'].ro,
			year: '2023',
		},
		{
			id: 9,
			title: 'Vila Florilor – Predeal',
			category: 'pensiuni-vile',
			categoryLabel: portfolioTranslations['portfolio.filter.pensiuniVile'].ro,
			description:
				portfolioTranslations['portfolio.project_vila_florilor.desc'].ro,
			location:
				portfolioTranslations['portfolio.project_vila_florilor.location'].ro,
			year: '2023',
		},
		{
			id: 10,
			title: 'Casa Santa Maria – Moieciu',
			category: 'pensiuni-vile',
			categoryLabel: portfolioTranslations['portfolio.filter.pensiuniVile'].ro,
			description:
				portfolioTranslations['portfolio.project_casa_santa.desc'].ro,
			location:
				portfolioTranslations['portfolio.project_casa_santa.location'].ro,
			year: '2022',
		},
		{
			id: 11,
			title: 'Rollart Sistem',
			category: 'constructii',
			categoryLabel: portfolioTranslations['portfolio.filter.constructii'].ro,
			description: portfolioTranslations['portfolio.project_rollart.desc'].ro,
			location: portfolioTranslations['portfolio.project_rollart.location'].ro,
			year: '2023',
		},
		{
			id: 12,
			title: 'Bitacom',
			category: 'constructii',
			categoryLabel: portfolioTranslations['portfolio.filter.constructii'].ro,
			description: portfolioTranslations['portfolio.project_bitacom.desc'].ro,
			location: portfolioTranslations['portfolio.project_bitacom.location'].ro,
			year: '2023',
		},
		{
			id: 13,
			title: 'Concept Happy House',
			category: 'constructii',
			categoryLabel: portfolioTranslations['portfolio.filter.constructii'].ro,
			description:
				portfolioTranslations['portfolio.project_happyhouse.desc'].ro,
			location:
				portfolioTranslations['portfolio.project_happyhouse.location'].ro,
			year: '2024',
		},
		{
			id: 14,
			title: 'Jeanina Crivac – Terapeut',
			category: 'altele',
			categoryLabel: portfolioTranslations['portfolio.filter.altele'].ro,
			description: portfolioTranslations['portfolio.project_jeanina.desc'].ro,
			location: portfolioTranslations['portfolio.project_jeanina.location'].ro,
			year: '2024',
		},
		{
			id: 15,
			title: 'Calota Boxing Gym',
			category: 'altele',
			categoryLabel: portfolioTranslations['portfolio.filter.altele'].ro,
			description: portfolioTranslations['portfolio.project_calota.desc'].ro,
			location: portfolioTranslations['portfolio.project_calota.location'].ro,
			year: '2024',
		},
	]

	const counts: Record<string, number> = categories.reduce(
		(acc, c) => {
			if (c.key === 'all') return acc
			acc[c.key] = projects.filter((p) => p.category === c.key).length
			return acc
		},
		{} as Record<string, number>,
	)

	return (
		<section className="py-12 lg:py-16 bg-background">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				{/* Filter */}
				<div className="flex flex-wrap items-center gap-2 mb-8">
					{categories.map((cat) => (
						<button
							key={cat.key}
							data-filter={cat.key}
							aria-label={`${cat.label}${cat.key !== 'all' ? ` (${counts[cat.key] ?? 0})` : ''}`}
							className={cn(
								'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
								'bg-muted text-muted-foreground hover:bg-muted/80',
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

				{/* Server rendered grouped sections with small data-attributes for client pagination */}
				{categories
					.filter((c) => c.key !== 'all')
					.map((cat) => {
						const all = projects.filter((p) => p.category === cat.key)
						const total = all.length
						const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
						return (
							<section
								key={cat.key}
								data-cat={cat.key}
								data-page-current={1}
								data-total-pages={totalPages}
								className="mb-10"
							>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">
										{cat.label}
										<span className="ml-3 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground">
											{total}
										</span>
									</h3>
								</div>
								{all.length === 0 ? (
									<p className="text-sm text-muted-foreground">—</p>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{all.map((project, i) => {
											const page = Math.floor(i / PAGE_SIZE) + 1
											const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'><rect fill='%23311b17' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='120' fill='%23a04b3b' font-family='Playfair Display, serif'>${String(project.id).padStart(2, '0')}</text></svg>`
											const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
											return (
												<article
													key={project.id}
													data-page={page}
													className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-500"
												>
													<div className="relative h-48 overflow-hidden">
														<Image
															src={src}
															alt={project.title}
															width={1200}
															height={600}
															className="object-cover w-full h-full"
														/>
													</div>
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
										})}
									</div>
								)}

								<div className="flex items-center gap-2 mt-4">
									<button
										data-cat={cat.key}
										data-action="prev"
										className="px-3 py-1 rounded-md text-sm bg-muted"
									>
										${portfolioTranslations['portfolio.pagination.prev'].ro}
									</button>
									<span className="text-sm text-muted-foreground page-indicator">
										1 / ${totalPages}
									</span>
									<button
										data-cat={cat.key}
										data-action="next"
										className="px-3 py-1 rounded-md text-sm bg-muted"
									>
										${portfolioTranslations['portfolio.pagination.next'].ro}
									</button>
								</div>
							</section>
						)
					})}

				{/* Tiny client script for filters & pagination (keeps React bundle minimal) */}
				<Script id="portfolio-grid" strategy="afterInteractive">
					{`(function(){
				  const PAGE_SIZE = ${PAGE_SIZE};
				  const sections = Array.from(document.querySelectorAll('[data-cat]'));
				  // init hide logic: show page 1 for each section
				  sections.forEach(s => {
				    const items = Array.from(s.querySelectorAll('[data-page]'));
				    items.forEach(it => {
				      it.style.display = parseInt(it.getAttribute('data-page')||'1',10) === 1 ? '' : 'none';
				    });
				    const total = parseInt(s.getAttribute('data-total-pages')||'1',10);
				    const indicator = s.querySelector('.page-indicator');
				    if(indicator) indicator.textContent = '1 / ' + total;
				  });

				  // filter buttons
				  document.querySelectorAll('button[data-filter]').forEach(btn => {
				    btn.addEventListener('click', () => {
				      const key = btn.getAttribute('data-filter');
				      sections.forEach(s => {
				        s.style.display = s.getAttribute('data-cat') === key || key === 'all' ? '' : 'none';
				      });
				    });
				  });

				  // pagination
				  document.querySelectorAll('button[data-action]').forEach(b => {
				    b.addEventListener('click', () => {
				      const action = b.getAttribute('data-action');
				      const cat = b.getAttribute('data-cat');
				      const sect = document.querySelector('[data-cat="'+cat+'"]');
				      if(!sect) return;
				      const total = parseInt(sect.getAttribute('data-total-pages')||'1',10);
				      const items = Array.from(sect.querySelectorAll('[data-page]'));
				      let current = parseInt(sect.getAttribute('data-page-current')||'1',10);
				      if(action === 'next') current = Math.min(total, current+1);
				      if(action === 'prev') current = Math.max(1, current-1);
				      sect.setAttribute('data-page-current', String(current));
				      items.forEach(it => it.style.display = parseInt(it.getAttribute('data-page')||'1',10) === current ? '' : 'none');
				      const indicator = sect.querySelector('.page-indicator'); if(indicator) indicator.textContent = current + ' / ' + total;
				    });
				  });
				})();`}
				</Script>
			</div>
		</section>
	)
}
