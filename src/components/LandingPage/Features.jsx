"use client"
import React, { useEffect } from 'react';
import Image from "next/image";
import { useTheme } from "next-themes";
import F1 from "@/public/images/f1.png";
import F2 from "@/public/images/f2.png";
import F3 from "@/public/images/f3.png";
import F4 from "@/public/images/f4.png";

export default function Features() {
  const { theme } = useTheme();

  useEffect(() => {
    // Function to handle text-to-speech
    const speakText = () => {
      // Get the content you want to read aloud
      const heroOverviewElement = document.querySelector('.Mega');

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
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className='Mega'>
      <div className="choose-me">WHY CHOOSE US?</div>
      <h1 className="f-heading">Services We Provide</h1>
      <div className="container">
        <div className="feature-1">
          <a href="http://localhost:8501/" target='blank'><Image
            src={theme === "dark" ? F1 : F1}
            alt="Feature 1"
            width={260}
            height={260}
            className="rounded-md p-10 m-20 mb-0"
          /></a>
          <div className="f1-text">
            <div className="f1-text-head">Course Recommendation</div>
            <p className="f1-text-text">Choose whatever course best suits your career.</p>
          </div>
        </div>
        <div className="feature-2">
          <a href="">
            <Image
              src={theme === "dark" ? F2 : F2}
              alt="Feature 2"
              width={260}
              height={260}
              className="rounded-md p-10 m-20 mb-0"
            />
          </a>
          <div className="f2-text">
            <div className="f1-text-head">Attendance Tracking</div>
            <p className="f1-text-text">Track Attendance of any of your classes.</p>
          </div>
        </div>
        <div className="feature-3">
          <a href="">
            <Image
              src={theme === "dark" ? F3 : F3}
              alt="Feature 3"
              width={260}
              height={260}
              className="rounded-md p-10 m-20 mb-0"
            />
          </a>
          <div className="f3-text">
            <div className="f1-text-head">Assignment Functionalities</div>
            <p className="f1-text-text">Assign assignments and also review them.</p>
          </div>
        </div>
        <div className="feature-4">
          <a href="">
            <Image
              src={theme === "dark" ? F4 : F4}
              alt="Feature 4"
              width={260}
              height={260}
              className="rounded-md p-10 m-20 mb-0"
            />
          </a>
          <div className="f4-text">
            <div className="f1-text-head">Marks Analysis</div>
            <p className="f1-text-text">Analyze the student's marks and review them.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
