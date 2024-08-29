"use client"

import { useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, auth } from "@/config/firebase";
import { useToast } from "@/components/ui/use-toast";

interface ScheduleLectureDialogProps {
  onClose: () => void;
}

export default function ScheduleLectureDialog({ onClose }: ScheduleLectureDialogProps) {
  const [className, setClassName] = useState("");
  const [division, setDivision] = useState("");
  const [year, setYear] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [lectureName, setLectureName] = useState(""); // New state for lectureName
  const [user] = useAuthState(auth);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) return;
  
    const lectureData = {
      class: className,
      div: division,
      year,
      time,
      date,
      lectureName, // Include lectureName in the lectureData object
    };
  
    const lectureDocRef = doc(db, "Lecture", user.uid);
  
    try {
      const docSnapshot = await getDoc(lectureDocRef);
  
      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();
        const currentLectures = docData?.lecture || [];
        const currentOngoingIndex = docData?.onGoing || 0;
  
        // Determine the index for the new lecture
        const newOngoingIndex = currentLectures.length;
  
        // Update the document with the new lecture and index
        await updateDoc(lectureDocRef, {
          lecture: arrayUnion(lectureData),
          onGoing: newOngoingIndex
        });
      } else {
        // Initialize the document with the new lecture and index
        await setDoc(lectureDocRef, {
          lecture: [lectureData],
          onGoing: 0 // Start with 0 if it's a new document
        });
      }
  
      setClassName("");
      setDivision("");
      setYear("");
      setTime("");
      setDate("");
      setLectureName(""); // Reset lectureName field
      toast({
        title: "Lecture Scheduled",
        description: "Your lecture has been successfully scheduled!",
      });
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error scheduling lecture: ", error);
    }
  };
  

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Schedule Lecture</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Lecture</DialogTitle>
          <DialogDescription>
            Enter the details for the new lecture below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lectureName" className="text-right">
              Lecture Name
            </Label>
            <Input
              id="lectureName"
              value={lectureName}
              onChange={(e) => setLectureName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="class" className="text-right">
              Class
            </Label>
            <Input
              id="class"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="division" className="text-right">
              Division
            </Label>
            <Input
              id="division"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">
              Year
            </Label>
            <Input
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Save Lecture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
