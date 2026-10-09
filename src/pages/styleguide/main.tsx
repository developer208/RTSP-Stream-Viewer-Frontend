import { type ReactNode, useEffect, useState } from 'react'

import {
  Button,
  Footer,
  Input,
  Loader,
  Modal,
  Navbar,
  NotificationHost,
  SplashScreen,
  useNotification,
} from '@/components'
import { cn } from '@/lib/cn'

const PREVIEW_DURATION_MS = 2000

interface ShowcaseProps {
  /** Component name, shown as the section heading. */
  name: string
  description: string
  /** Dark previews are for components designed to sit on the dark page background. */
  dark?: boolean
  children: ReactNode
}

function Showcase({ name, description, dark = false, children }: ShowcaseProps) {
  return (
    <section>
      <h2 className="font-mono text-lg font-semibold text-white">{name}</h2>
      <p className="mt-1 text-sm text-neutral-400">{description}</p>
      <div
        className={cn(
          // `overflow-hidden` keeps sticky and full-width components inside the preview box.
          'mt-4 overflow-hidden rounded-xl border border-white/10',
          dark ? 'bg-neutral-950' : 'bg-white p-6 text-neutral-900',
        )}
      >
        {children}
      </div>
    </section>
  )
}

function Main() {
  const notification = useNotification()
  const [url, setUrl] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [isSplashVisible, setIsSplashVisible] = useState(false)

  // The overlay loader and splash screen cover the page, so hide them again after a moment.
  useEffect(() => {
    if (!isOverlayVisible && !isSplashVisible) {
      return
    }
    const timer = setTimeout(() => {
      setIsOverlayVisible(false)
      setIsSplashVisible(false)
    }, PREVIEW_DURATION_MS)
    return () => clearTimeout(timer)
  }, [isOverlayVisible, isSplashVisible])

  const isUrlInvalid = url !== '' && !url.startsWith('rtsp://')

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <NotificationHost />
      <SplashScreen visible={isSplashVisible} />
      {isOverlayVisible ? <Loader overlay label="Connecting to stream…" /> : null}

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 lg:px-10">
        <header>
          <h1 className="text-4xl font-medium tracking-tight text-neutral-200 sm:text-5xl">Styleguide</h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-300">
            Every custom component in the app, shown with its name.
          </p>
        </header>

        <Showcase name="Button" description="Variants, colours, and the loading and disabled states.">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
            <Button color="success">Success</Button>
            <Button color="error">Error</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Showcase>

        <Showcase name="Input" description="Text field with a label and an error message. Type a URL to see validation.">
          <div className="max-w-md">
            <Input
              label="RTSP URL"
              placeholder="rtsp://host:8554/stream"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              errorMessage={isUrlInvalid ? 'URL must start with rtsp://' : undefined}
            />
          </div>
        </Showcase>

        <Showcase name="Loader" description="Inline spinner, with an optional label, or a full-screen overlay.">
          <div className="flex flex-wrap items-center gap-8">
            <Loader />
            <Loader label="Loading streams…" />
            <Button variant="outlined" onClick={() => setIsOverlayVisible(true)}>
              Show overlay loader
            </Button>
          </div>
        </Showcase>

        <Showcase name="Modal" description="Dialog with a heading, a cross icon, and cancel and submit buttons. Clicking outside closes it.">
          <Button variant="outlined" onClick={() => setIsModalOpen(true)}>
            Open modal
          </Button>
        </Showcase>

        <Showcase
          name="NotificationHost / useNotification"
          description="Toast messages. The host renders them; the hook triggers them from anywhere."
        >
          <div className="flex flex-wrap gap-3">
            <Button color="success" onClick={() => notification.success('Stream added')}>
              Success
            </Button>
            <Button color="error" onClick={() => notification.error('Could not connect to stream')}>
              Error
            </Button>
            <Button color="warning" onClick={() => notification.warning('Stream is unstable')}>
              Warning
            </Button>
            <Button color="info" onClick={() => notification.info('Reconnecting…')}>
              Info
            </Button>
          </div>
        </Showcase>

        <Showcase name="SplashScreen" description="Full-screen loading screen shown while the app starts.">
          <Button variant="outlined" onClick={() => setIsSplashVisible(true)}>
            Show splash screen
          </Button>
        </Showcase>

        <Showcase name="Navbar" description="Top navigation bar with the logo, page links and sign-in actions." dark>
          <Navbar />
        </Showcase>

        <Showcase name="Footer" description="Page footer with link columns and the large wordmark." dark>
          <Footer />
        </Showcase>
      </main>

      <Footer />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => setIsModalOpen(false)}
        heading="Remove stream"
        submitLabel="Remove"
      >
        This stream will be removed from the grid.
      </Modal>
    </div>
  )
}

export default Main
