'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  type Language,
  type TranslationKey,
  LANGUAGE_KEY,
  DEFAULT_LANGUAGE,
  translations,
} from '@/lib/i18n'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY) as Language | null
    if (stored && stored in translations) setLanguageState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_KEY, lang)
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let str: string = translations[language][key] ?? translations[DEFAULT_LANGUAGE][key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v))
      }
    }
    return str
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used inside LanguageProvider')
  return ctx
}
