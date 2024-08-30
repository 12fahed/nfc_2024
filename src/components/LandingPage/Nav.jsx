"use client"
import React from 'react'
import './Landing.css'
import Image from "next/image";
import { useTheme } from "next-themes";
import LOGO from "@/public/images/logo.png"
import PROFILE from "@/public/images/profile.png"

export default function Navbar() {
const { theme } = useTheme();
  return (
    <div>
        <header>
            <div className="heading">
                <Image
                src={theme === "dark" ? LOGO : LOGO}
                alt="Feature 1"
                width={50}
                height={50}
                className=""
            />
                <div className="logo">
                    <div id="logo1">Kaksha</div>
                </div>
            </div>
            
            <nav className="navbar">
                <ul >
                    <a className='nav_links' href="">Home</a>
                    <a className='nav_links' href="">Dashboard</a>
                    <a className='nav_links' href="">Contact Us</a>
                </ul>
            </nav>

            <div >
                <a href="/auth"><Image
                src={theme === "dark" ? PROFILE : PROFILE}
                alt="Feature 1"
                width={50}
                height={50}
                className=""
            /></a>
            
            </div>
        </header>
    </div>
  )
}
