'use client'

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import { navTranslations } from './translations/nav'
import { heroTranslations } from './translations/hero'
import { aboutTranslations } from './translations/about'
import { teamTranslations } from './translations/team'
import { ctaTranslations } from './translations/cta'
import { contactTranslations } from './translations/contact'
import { footerTranslations } from './translations/footer'
import { servicesTranslations } from './translations/services'
import { faqTranslations } from './translations/faq'

// Portfolio translations are large and only needed on the /portfolio page.
// We lazy-load them when the portfolio page or component mounts to reduce
// the initial client bundle size.
export async function loadPortfolioTranslations() {
	const mod = await import('./translations/portfolio')
	Object.assign(translations, mod.portfolioTranslations)
}
import { newsletterTranslations } from './translations/newsletter'

export type Locale = 'ro' | 'en'

interface Translations {
	[key: string]: {
		ro: string
		en: string
	}
}

// Merge all translations
export const translations: Translations = {
	...navTranslations,
	...heroTranslations,
	...aboutTranslations,
	...teamTranslations,
	...ctaTranslations,
	...contactTranslations,
	...footerTranslations,
	...servicesTranslations,
	...faqTranslations,
	...newsletterTranslations,
}

interface I18nContextType {
	locale: Locale
	setLocale: (locale: Locale) => void
	t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
	const [locale, setLocale] = useState<Locale>('ro')

	useEffect(() => {
		// Check for saved preference or browser language
		const saved = localStorage.getItem('locale') as Locale
		if (saved && (saved === 'ro' || saved === 'en')) {
			setLocale(saved)
		} else {
			const browserLang = navigator.language.toLowerCase()
			if (browserLang.startsWith('en')) {
				setLocale('en')
			}
		}
	}, [])

	const handleSetLocale = (newLocale: Locale) => {
		setLocale(newLocale)
		localStorage.setItem('locale', newLocale)
	}

	const t = (key: string): string => {
		const translation = translations[key]
		if (!translation) return key
		return translation[locale] || translation.ro || key
	}

	// Prevent hydration mismatch by not rendering until client is ready
	// Use suppressHydrationWarning on critical elements instead
	return (
		<I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
			{children}
		</I18nContext.Provider>
	)
}

export function useI18n() {
	const context = useContext(I18nContext)
	if (!context) {
		throw new Error('useI18n must be used within an I18nProvider')
	}
	return context
}
