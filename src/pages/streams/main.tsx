import { StreamBoard } from '@/components'

// Same viewer as the demo, starting with the streams saved to the logged-in user's account.
function Main() {
  return <StreamBoard loadSavedStreams />
}

export default Main
