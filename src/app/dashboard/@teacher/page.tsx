"use client";
import { useState } from "react";
import TeacherClass from "@/components/TeacherClass"; // Replace with actual import
import TeacherLecture from "@/components/TeacherLecture"; // Replace with actual import
import { StudentTable } from "@/components/TeacherDashTable"; // Import the StudentTable component
import { Button } from "@/components/ui/button";
import SubmissionsTable from "@/components/AssignmentSubmit";

export default function TeacherDashboard() {
  const [view, setView] = useState("class");

  const renderView = () => {
    if (view === "class") {
      return <TeacherClass />;
    } else if (view === "lecture") {
      return <TeacherLecture />;
    } else if (view === "attendance") {
      return <StudentTable />;
    } else if (view === "submission") {
      return <SubmissionsTable />;
    } 
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F4' }}>
      <header className="bg-white shadow-md p-4">
      <h1 className="text-5xl font-josefin font-bold text-gray-800 text-center">Teacher Dashboard</h1>
      </header>
      <nav className="bg-white p-4 shadow-inner flex justify-center space-x-8 mb-6">
        <Button
          onClick={() => setView("class")}
          className={`px-6 py-2 rounded-full ${
            view === "class"
              ? "bg-purple-950 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Class Management
        </Button>
        <Button
          onClick={() => setView("lecture")}
          className={`px-6 py-2 rounded-full ${
            view === "lecture"
              ? "bg-purple-950 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Lecture Scheduling
        </Button>
        <Button
          onClick={() => setView("attendance")}
          className={`px-6 py-2 rounded-full ${
            view === "attendance"
              ?"bg-purple-950 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Student Attendance
        </Button>
        <Button
          onClick={() => setView("submission")}
          className={`px-6 py-2 rounded-full ${
            view === "submission"
              ? "bg-purple-950 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Submission
        </Button>
        <Button
            onClick={() => window.open("http://127.0.0.1:9998/", "_blank")}
            className={`px-6 py-2 rounded-full ${
              view === ""
                ? "bg-purple-950 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Online Classes
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
