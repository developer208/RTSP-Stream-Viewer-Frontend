import VideocamRounded from '@mui/icons-material/VideocamRounded'
import { Link } from 'react-router-dom'

import { FOOTER_CONTENT } from '@/utils/constants'
import type { FOOTER_LINK_TYPE } from '@/utils/types'

const APP_NAME = 'RTSP Stream Viewer'

const LINK_CLASS_NAME = 'whitespace-nowrap text-sm text-neutral-300 transition-colors hover:text-white'

function FooterLink({ link }: { link: FOOTER_LINK_TYPE }) {
  if (/^https?:\/\//.test(link.url)) {
    return (
      <a href={link.url} target="_blank" rel="noreferrer" className={LINK_CLASS_NAME}>
        {link.label}
      </a>
    )
  }

  return (
    <Link to={link.url} className={LINK_CLASS_NAME}>
      {link.label}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 bg-neutral-950 px-6 lg:px-10">
      <div className="@container mx-auto max-w-7xl border-t border-white/10 pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:px-16">
          <div>
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex size-8 items-center justify-center rounded-lg bg-white text-neutral-950">
                <VideocamRounded fontSize="small" />
              </span>
              {APP_NAME}
            </Link>
            <p className="mt-6 text-sm text-neutral-500">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-10 sm:grid-cols-4">
            {Object.entries(FOOTER_CONTENT).map(([title, links]) => (
              <div key={title}>
                <h2 className="text-sm font-semibold capitalize text-neutral-200">{title}</h2>
                <ul className="mt-4 flex flex-col gap-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p
          aria-hidden
          className="select-none whitespace-nowrap py-16 text-center text-[9.5cqw] font-bold leading-none tracking-tight text-neutral-900"
        >
          {APP_NAME}
        </p>
      </div>
    </footer>
  )
}
