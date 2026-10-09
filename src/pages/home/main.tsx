import { Link } from 'react-router-dom'

import { Footer, GoogleIcon, Navbar } from '@/components'
import { useAuth } from '@/hooks/useAuth'

import HeroScreen from './HeroScreen'

function Main() {
  const { isLoggedIn, openLoginModal } = useAuth()

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Decorative diagonal stripes on the right edge of the hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 hidden h-[1100px] w-80 rotate-[38deg] md:block"
          style={{
            background:
              'linear-gradient(to right, #8b5cf6 0 44%, #d946ef 44% 54%, #f43f5e 54% 66%, #fb923c 66% 83%, #fde68a 83% 100%)',
          }}
        />

        <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-10 lg:pt-32">
          <button
            type="button"
            onClick={openLoginModal}
            disabled={isLoggedIn}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/10"
          >
            <GoogleIcon />
            Sign in with Google to save your streams
            <span aria-hidden>→</span>
          </button>

          <h1 className="mt-4 max-w-3xl text-5xl font-medium tracking-tight text-neutral-200 sm:text-6xl lg:text-7xl">
            Watch your RTSP cameras live in the browser.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-300 sm:text-xl">
            Paste an RTSP URL and start watching in seconds. View multiple streams side by side, with
            nothing to install.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/app"
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
            >
              Get Started
              <span aria-hidden>→</span>
            </Link>
            <a
              href="#preview"
              className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/15"
            >
              Learn More
            </a>
          </div>
        </section>

        <HeroScreen />
      </main>

      <Footer />
    </div>
  )
}

export default Main
