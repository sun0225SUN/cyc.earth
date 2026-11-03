import { appConfig } from '@/shared/lib/config'

/** When true, home and the finish are cut from tracks before they reach the browser. */
export const privacyMode = appConfig.privacy.mode

/** Meters cut from the start and from the end while `privacyMode` is on. */
export const privacyHideMeters = appConfig.privacy.hideMeters
