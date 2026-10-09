import { Button } from '@/components/Button/Button'
import { GoogleIcon } from '@/components/GoogleIcon/GoogleIcon'
import { Modal } from '@/components/Modal/Modal'
import { useAuth } from '@/hooks/useAuth'
import { GOOGLE_LOGIN_URL } from '@/utils/constants'

// Rendered once at the app root; opened from anywhere with `useAuth().openLoginModal()`.
export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuth()

  const signInWithGoogle = () => {
    // Tell the backend which page to come back to once Google sign-in is done.
    const returnPath = window.location.pathname + window.location.search
    // A full page navigation, not a fetch: the browser has to follow the redirect to Google.
    window.location.assign(`${GOOGLE_LOGIN_URL}?redirect=${encodeURIComponent(returnPath)}`)
  }

  return (
    <Modal
      open={isLoginModalOpen}
      onClose={closeLoginModal}
      heading="Sign in"
      maxWidth="xs"
      isCancelButtonVisible={false}
      isSubmitButtonVisible={false}
    >
      <p className="mb-6">Sign in to save your streams and pick up where you left off.</p>
      <Button
        fullWidth
        size="large"
        startIcon={<GoogleIcon />}
        onClick={signInWithGoogle}
        className="mb-2 bg-white text-neutral-950 hover:bg-neutral-200"
      >
        Sign in with Google
      </Button>
    </Modal>
  )
}
