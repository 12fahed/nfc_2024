"use client"
import React, { useEffect } from 'react';
import Image from "next/image";
import { useTheme } from "next-themes";
import HERO from "@/public/images/hero-image.png"
import "./Landing.css"

export default function Hero() {
  const { theme } = useTheme();
  useEffect(() => {
    // Function to handle text-to-speech
    const speakText = () => {
      // Get the content you want to read aloud
      const heroOverviewElement = document.querySelector('.hero-text');

      if (!heroOverviewElement) {
        console.error('Text element not found!');
        return;
      }

      const content = heroOverviewElement.innerText;
      if (!content) {
        console.error('No text content found!');
        return;
      }

      // Create a new SpeechSynthesisUtterance object
      const utterance = new SpeechSynthesisUtterance(content);

      // Set the language (optional)
      utterance.lang = 'en-US';

      // Set other properties like pitch, rate, and volume (optional)
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;

      // Speak the content
      window.speechSynthesis.speak(utterance);
    };

    // Call speakText function after the component mounts
    speakText();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <div className="main-hero">
        <div className="text-area">
          <div className="hero-text" style={{width:800}}>
            <h3 className="introduce" style={{width:400}}>INTRODUCING KAKSHA</h3>
            <h1 className="hero-main-text" style={{gap:2,paddingTop:0}}>Transformation of Management of Education</h1>
            <div className="hero-overview" style={{width:700,paddingTop:0}}>
              Automate attendance, assignments, and exams to streamline education management. Real-time monitoring and analytics enhance student performance and simplify processes.
            </div>
          </div>
          <div className="chatbot">
            <button className="simple-button">Chat Bot</button>
          </div>
        </div>
        <div className="hero-image">
        <Image
            src={theme === "dark" ? HERO : HERO}
            alt="Feature 1"
            width={600}
            height={650}
            className="hero-figma"
          />
        </div>
      </div>
    </div>
  );
}
