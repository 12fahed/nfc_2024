"use client";
import { useState } from "react";
import CreateClassDialog from "@/components/CreateClassDialog";
import { Button } from "@/components/ui/button";
import ClassCards from "@/components/DisplayClass";

export default function TeacherClass() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4" style={{ backgroundColor: '#F9F7F4' }}>
      <h1 className="text-4xl font-josefin mb-6 ml-3 font-semibold">Welcome to the Class Management System</h1>
      <Button onClick={handleOpen} className="bg-orange-600 text-white hover:bg-orange-700 w-[100px] m-2 mb-4 ml-4">
        Create Class
      </Button >
      {dialogOpen && <CreateClassDialog onClose={handleClose} />}
      <div className="p-4">
        <ClassCards />
      </div>
    </div>
  );
}
