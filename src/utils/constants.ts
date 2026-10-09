import { faGithub, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons'

import type {
  CONTACT_LINK_TYPE,
  FOOTER_CONTENT_TYPE,
  NAV_LINKS_TYPE,
  PREVIEW_STREAM_TYPE,
  STREAM_STATUS_STYLE_TYPE,
  STREAM_STATUS_TYPE,
} from "./types";

// Backend address. An empty VITE_API_URL means "the same address the page was loaded from",
// which is the production setup: nginx serves the site and forwards /api and /ws to the backend.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

// Same host as the API, over ws:// (or wss:// when the API is https://).
export const WS_URL = (API_URL || window.location.origin).replace(/^http/, 'ws')

// Opening this URL in the browser starts Google sign-in; the backend redirects to Google from there.
export const GOOGLE_LOGIN_URL = `${API_URL}/api/auth/google/login`

export const NAV_LINKS: NAV_LINKS_TYPE[] = [
  { label: 'Streams', href: '/streams', requiresLogin: true },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
]

export const FOOTER_CONTENT: FOOTER_CONTENT_TYPE = {
  pages: [
    { label: 'Home', url: '/' },
    { label: 'Features', url: '/features' },
    { label: 'How it works', url: '/how-it-works' },
    { label: 'Contact', url: '/contact' },
    { label: 'Styleguide', url: '/styleguide' },
  ],
  socials: [
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com' },
    { label: 'Twitter', url: 'https://x.com' },
  ],
  legal: [
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Terms of Service', url: '/terms' },
  ],
  register: [
    { label: 'Login', url: '/login' },
    { label: 'Try for free', url: '/demo' },
  ],
}

export const MOBILE_BREAKPOINT_PX = 768

export const STREAM_STATUS_STYLES: Record<STREAM_STATUS_TYPE, STREAM_STATUS_STYLE_TYPE> = {
  idle: { label: 'Not started', dotClassName: 'bg-neutral-400' },
  connecting: { label: 'Connecting', dotClassName: 'bg-yellow-500' },
  live: { label: 'Live', dotClassName: 'bg-green-500' },
  paused: { label: 'Paused', dotClassName: 'bg-neutral-400' },
  reconnecting: { label: 'Reconnecting', dotClassName: 'bg-yellow-500' },
  disconnected: { label: 'Disconnected', dotClassName: 'bg-red-500' },
}

export const PREVIEW_STREAMS: PREVIEW_STREAM_TYPE[] = [
  { name: 'Front gate', status: 'live', tint: 'from-sky-900 to-slate-900' },
  { name: 'Lobby', status: 'live', tint: 'from-emerald-900 to-slate-900' },
  { name: 'Parking', status: 'live', tint: 'from-indigo-900 to-slate-900' },
  { name: 'Warehouse', status: 'live', tint: 'from-amber-900 to-slate-900' },
  { name: 'Loading dock', status: 'reconnecting', tint: 'from-neutral-800 to-neutral-900' },
  { name: 'Office', status: 'disconnected', tint: 'from-rose-900 to-slate-900' },
]

export const CONTACT_LINKS: CONTACT_LINK_TYPE[] = [
  { platform: 'GitHub', username: 'developer208', url: 'https://github.com/developer208', icon: faGithub },
  {
    platform: 'LinkedIn',
    username: 'Vedang Mule',
    url: 'https://www.linkedin.com/in/vedang-mule-8963421bb',
    icon: faLinkedin,
  },
  { platform: 'X', username: '@Vedang208', url: 'https://x.com/Vedang208', icon: faXTwitter },
]
