"use client";
import { useState } from "react";
import CreateClassDialog from "@/components/CreateClassDialog";
import { Button } from "@/components/ui/button";
import ClassCards from "@/components/DisplayClass";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Class Management System</h1>
      <Button onClick={handleOpen} className="btn-primary">
        Create Class
      </Button >
      {dialogOpen && <CreateClassDialog onClose={handleClose} />}
      <div className="p-4">
        <ClassCards />
      </div>
    </div>
  );
}
