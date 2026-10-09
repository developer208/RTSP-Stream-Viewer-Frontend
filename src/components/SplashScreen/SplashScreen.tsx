import VideocamRounded from '@mui/icons-material/VideocamRounded'
import LinearProgress from '@mui/material/LinearProgress'
import { AnimatePresence, motion } from 'motion/react'

export interface SplashScreenProps {
  visible: boolean
  title?: string
  subtitle?: string
}

export function SplashScreen({
  visible,
  title = 'RTSP Stream Viewer',
  subtitle = 'Preparing your streams…',
}: SplashScreenProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="splash"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-4 bg-slate-950 text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <VideocamRounded className="text-6xl" />
          </motion.div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-slate-400">{subtitle}</p>
          <LinearProgress color="inherit" className="mt-2 w-40 rounded-full" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
