import { tv } from 'tailwind-variants'

const deepMerge = (target: any, source: any) => {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        if (!target[key]) {
          target[key] = {}
        }
        deepMerge(target[key], source[key])
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}
/**
 * Get the UI configuration for a specific component.
 * @param key The component key.
 * @param extendedThemes The extended themes to merge.
 * @param variant The variant to apply.
 * @returns The merged UI configuration.
 */
export const componentUI = <T>(key:string, baseTheme: T, extendedTheme?: T) => {
  const appConfig = useAppConfig()
  const appTheme = appConfig?.ui?.[key] || {}
  let extend = {}
  if(extendedTheme) {
    extend = tv({ extend: baseTheme, ...extendedTheme })
  } else {
    extend = tv({ extend: baseTheme })
  }
  const theme= tv({ extend: appTheme, ...extend })
  return (...args: any[]) => {
    return {
      ...theme(...args),
      components: deepMerge(
        baseTheme?.components || {},
        appTheme?.components || {},
        extendedTheme?.components || {}
      )
    }
  }
}