import Background from './components/Background'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Timeline from './components/Timeline'
import Projects from './components/Projects'
import Stack from './components/Stack'
import Contact from './components/Contact'

export default function App() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Timeline />
        <Projects />
        <Stack />
        <Contact />
      </main>
    </>
  )
}
