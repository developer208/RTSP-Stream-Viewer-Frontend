import { Footer, Navbar } from '@/components'

function Main() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-24 lg:px-10">
        <h1 className="text-4xl font-medium tracking-tight text-neutral-200 sm:text-5xl">Architecture</h1>
      </main>

      <Footer />
    </div>
  )
}

export default Main
