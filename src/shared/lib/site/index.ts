import { appConfig } from '@/shared/lib/config'

export const githubRepositoryUrl = appConfig.site.githubRepositoryUrl
export const productionSiteUrl = appConfig.site.productionSiteUrl

export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (process.env.VERCEL_ENV === 'production') return productionSiteUrl
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim()
  if (vercel) {
    return vercel.startsWith('http')
      ? vercel.replace(/\/$/, '')
      : `https://${vercel}`
  }
  return appConfig.site.localSiteUrl
}
