"use client"
import { useState } from 'react'
import './Landing.css'
import Nav from './Nav'
import Hero from './Hero'
import Features from './Features'

function Landing() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Nav />
      <Hero />
      <Features />
    </div>
  )
}

export default Landing
