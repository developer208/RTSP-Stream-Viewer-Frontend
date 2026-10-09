import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { LoginModal, ScrollToTop } from '@/components'
import { AuthProvider } from '@/context/AuthProvider'
import Contact from '@/pages/contact/main'
import Demo from '@/pages/demo/main'
import Home from '@/pages/home/main'
import HowItWorks from '@/pages/how-it-works/main'
import Stream from '@/pages/stream/main'
import Streams from '@/pages/streams/main'
import Styleguide from '@/pages/styleguide/main'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/streams" element={<Streams />} />
          <Route path="/styleguide" element={<Styleguide />} />
        </Routes>
        <LoginModal />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
