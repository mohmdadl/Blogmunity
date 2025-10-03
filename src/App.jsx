import { useState } from 'react'
import { Router, Routes } from 'react-router-dom'
import { BrowserRouter as Router,Routes,Route,List } from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
