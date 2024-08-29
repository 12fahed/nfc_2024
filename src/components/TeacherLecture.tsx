"use client";
import { useState } from "react";
import ScheduleLectureDialog from "@/components/CreateLectureDialog"; // Make sure to create this file
import { Button } from "@/components/ui/button";
import LectureCards from "@/components/DisplayLecture"; // Adjust according to your component

export default function TeacherLecture() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Lecture Scheduling System</h1>
      <Button onClick={handleOpen} className="btn-primary">
        Schedule Lecture
      </Button>
      {dialogOpen && <ScheduleLectureDialog onClose={handleClose} />}
      <div className="p-4">
        <LectureCards /> {/* Adjust according to your component */}
      </div>
    </div>
  );
}
