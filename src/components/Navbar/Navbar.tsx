import { Tooltip } from '@/components/Tooltip/Tooltip'
import { useAuth } from '@/hooks/useAuth'
import { NAV_LINKS } from '@/utils/constants'
import LockRounded from '@mui/icons-material/LockRounded'
import VideocamRounded from '@mui/icons-material/VideocamRounded'
import { Link, useNavigate } from 'react-router-dom'



export function Navbar() {
  const navigate = useNavigate()
  const { user, isLoggedIn, isAuthLoading, openLoginModal, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-10"
      >
        <Link to="/" className="flex items-center gap-2 justify-self-start font-semibold text-white">
          <VideocamRounded fontSize="small" />
          <span className="whitespace-nowrap">RTSP Stream Viewer</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {link.requiresLogin && !isLoggedIn ? (
                <Tooltip
                  title={
                    <>
                      <LockRounded className="text-base text-fuchsia-400" />
                      Login to view your past streams
                    </>
                  }
                >
                  <span aria-disabled className="cursor-not-allowed text-sm text-neutral-400 opacity-40">
                    {link.label}
                  </span>
                </Tooltip>
              ) : (
                <a
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault()
                    navigate(link.href)
                  }}
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="col-start-3 flex items-center gap-4 justify-self-end">
          {/* Nothing is shown until the session check finishes, so "Login" never flashes for a logged-in user. */}
          {!isAuthLoading && user ? (
            // `group` lets the menu below react to hovering (or focusing) anything inside this wrapper.
            <div className="group relative">
              <button type="button" aria-label="Account menu" className="block cursor-pointer rounded-full">
                <img
                  src={user.picture}
                  alt=""
                  // Google's image server can refuse requests that carry a referrer.
                  referrerPolicy="no-referrer"
                  className="size-9 rounded-full border border-white/20 bg-neutral-800 object-cover"
                />
              </button>

              {/* Slides down from the navbar on hover. The top padding bridges the gap so it stays open while the pointer moves onto it. */}
              <div className="invisible absolute right-0 top-full w-60 -translate-y-3 pt-3 opacity-0 transition-all duration-200 ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-xl border border-white/10 bg-neutral-900 p-2 shadow-xl">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                    <p className="truncate text-xs text-neutral-400">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-1 w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          {!isAuthLoading && !isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={openLoginModal}
                className="hidden cursor-pointer text-sm text-neutral-400 transition-colors hover:text-white sm:block"
              >
                Login
              </button>
              <Link
                to="/demo"
                className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
              >
                Try for free
              </Link>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  )
}
