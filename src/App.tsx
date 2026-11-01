import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Timeline from './components/Timeline'
import Projects from './components/Projects'
import Stack from './components/Stack'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="grain">
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Timeline />
        <Stack />
        <Contact />
      </main>
    </div>
  )
}
