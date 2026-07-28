import Nav from './components/Nav'
import Hero from './sections/Hero'

function App() {
  return (
    <div className="bg-neutral-950 text-white min-h-screen">
      <Nav />
      <Hero />
      <section id="about" className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">About section placeholder</h1>
      </section>
    </div>
  )
}

export default App