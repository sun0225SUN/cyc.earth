import raw from '@/config.yml'
import { type AppConfig, parseAppConfig } from './parse-app-config'

export const appConfig: AppConfig = parseAppConfig(raw)

export type { AppConfig }
export { parseAppConfig }
