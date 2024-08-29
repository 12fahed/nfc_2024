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

interface CreateClassDialogProps {
  onClose: () => void;
}

export default function CreateClassDialog({ onClose }: CreateClassDialogProps) {
  const [year, setYear] = useState("");
  const [className, setClassName] = useState("");
  const [division, setDivision] = useState("");
  const [user] = useAuthState(auth);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) return;

    const classData = {
      year,
      class: className,
      div: division,
    };

    const userDocRef = doc(db, "Class", user.uid);

    try {
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        await updateDoc(userDocRef, {
          classes: arrayUnion(classData),
        });
      } else {
        await setDoc(userDocRef, {
          classes: [classData],
        });
      }

      setYear("");
      setClassName("");
      setDivision("");
      toast({
        title: "Class Created",
        description: "Your class has been successfully added!",
      });
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating class: ", error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>

      <DialogTrigger asChild>
        <Button variant="outline">Create Class</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
          <DialogDescription>
            Enter the details for the new class below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Save Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
