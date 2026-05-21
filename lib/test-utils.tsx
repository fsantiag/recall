import { render, type RenderOptions } from '@testing-library/react'
import { LanguageProvider } from '@/components/organisms/language-provider'

// Wraps components with LanguageProvider defaulting to English for stable text matchers.
export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  localStorage.setItem('recall_language', 'en')
  return render(ui, { wrapper: LanguageProvider, ...options })
}
