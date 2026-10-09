import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Footer, Navbar } from '@/components'
import { CONTACT_LINKS } from '@/utils/constants'

function Main() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <h1 className="text-4xl font-medium tracking-tight text-neutral-200 sm:text-5xl">Contact</h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-300">Find me on any of these platforms.</p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CONTACT_LINKS.map((link) => (
            <div key={link.platform} className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <FontAwesomeIcon icon={link.icon} className="text-4xl" />
              <h2 className="mt-6 text-sm text-neutral-400">{link.platform}</h2>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block break-all text-lg font-medium text-white hover:underline"
              >
                {link.username}
              </a>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Main
