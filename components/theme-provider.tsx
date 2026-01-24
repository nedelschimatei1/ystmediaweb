'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  
  return {
    theme: currentTheme || 'light',
    setTheme,
    isSystem: theme === 'system',
  }
}
