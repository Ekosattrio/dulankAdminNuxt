interface LegacyPageOptions {
  title: string
  styles?: string[]
  scripts?: string[]
  sweetAlert?: boolean
}

/** Keep existing page declarations working while Nuxt/Vue own the page lifecycle. */
export function useLegacyPage(options: LegacyPageOptions) {
  // Legacy asset lists remain accepted for existing callers. Loading those global
  // styles/scripts would override Tailwind and duplicate Vue-managed interactions.
  return useHead({ title: options.title })
}
