import Nav from './components/Nav'

function App() {
  return (
    <div className="bg-neutral-950 text-white min-h-screen">
      <Nav />
      <section id="home" className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Home section placeholder</h1>
      </section>
      <section id="about" className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">About section placeholder</h1>
      </section>
    </div>
  )
}

export default App