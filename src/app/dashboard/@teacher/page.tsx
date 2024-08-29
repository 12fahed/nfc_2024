"use client";
  
import { useState } from "react";
import { useRouter } from "next/navigation"; // Use this to navigate programmatically
import TeacherClass from "@/components/TeacherClass"; // Replace with actual import
import TeacherLecture from "@/components/TeacherLecture"; // Replace with actual import
import { Button } from "@/components/ui/button";

export default function TeacherDashboard() {
  const [view, setView] = useState("class");
  const router = useRouter();

  const handleLogout = () => {
    // Clear any stored tokens or session data
    localStorage.removeItem("authToken"); // Replace with your actual key
    sessionStorage.removeItem("authToken"); // If you use sessionStorage

    // Redirect to login page
    router.push("/");
  };

  const renderView = () => {
    if (view === "class") {
      return <TeacherClass />;
    } else if (view === "lecture") {
      return <TeacherLecture />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">Teacher Dashboard</h1>
        <Button 
          onClick={handleLogout} 
          className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
        >
          Logout
        </Button>
      </header>
      <nav className="bg-white p-4 shadow-inner flex justify-center space-x-8 mb-6">
        <Button
          onClick={() => setView("class")}
          className={`px-6 py-2 rounded-full ${
            view === "class"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Class Management
        </Button>
        <Button
          onClick={() => setView("lecture")}
          className={`px-6 py-2 rounded-full ${
            view === "lecture"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Lecture Scheduling
        </Button>
      </nav>
      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">{renderView()}</div>
      </main>
      {/* <footer className="bg-white p-4 text-center text-gray-500 text-sm shadow-inner">
        © 2024 Your School Name - All Rights Reserved
      </footer> */}
    </div>
  );
}
