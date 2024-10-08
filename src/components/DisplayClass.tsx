"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, auth, storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FileTextIcon } from "@radix-ui/react-icons";

interface ClassData {
  year: string;
  class: string; 
  div: string;
  notes?: { url: string; dueDate: string }[];
}

const ClassCards = () => {
  const [user] = useAuthState(auth);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return;
    
      const userDocRef = doc(db, "Class", user.uid);
    
      try {
        const docSnapshot = await getDoc(userDocRef);
    
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const fetchedClasses = Array.isArray(data.classes) ? data.classes : [];
          setClasses(fetchedClasses);
        } else {
          setClasses([]);
        }
      } catch (error) {
        console.error("Error fetching classes: ", error);
      }
    };
    

    fetchClasses();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !selectedClass || !dueDate) return;

    setLoading(true);

    const storageRef = ref(storage, `Assignment/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const updatedClasses = classes.map((cls) => {
        if (cls === selectedClass) {
          return {
            ...cls,
            notes: cls.notes
              ? [...cls.notes, { url: downloadURL, dueDate }]
              : [{ url: downloadURL, dueDate }],
          };
        }
        return cls;
      });

      await updateDoc(doc(db, "Class", user!.uid), {
        classes: updatedClasses,
      });

      setClasses(updatedClasses);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading file: ", error);
    } finally {
      setLoading(false);
      setFile(null);
      setSelectedClass(null);
      setDueDate("");
    }
  };

  const openModal = (classItem: ClassData) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {classes.map((classItem, index) => (
        <Card key={index} className="w-full max-w-sm ml-1 border-2 border-black border-solid">
          <CardHeader>
            <CardTitle>{classItem.class}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <p>Year: {classItem.year}</p>
              <p>Division: {classItem.div}</p>
              <Button variant="outline" onClick={() => openModal(classItem)}>
                View & Upload Notes
              </Button>
            </CardDescription>
          </CardContent>
        </Card>
      ))}

      {selectedClass && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedClass.class} - Notes</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedClass.notes && selectedClass.notes.length > 0 ? (
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">Uploaded Notes:</h3>
                  <div className="flex flex-col gap-2">
                    {selectedClass.notes.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-100"
                      >
                        <FileTextIcon className="w-5 h-5 text-gray-600" />
                        <a
                          href={note.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline truncate"
                        >
                          Note {index + 1} (Due: {note.dueDate})
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No notes uploaded yet.</p>
              )}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input id="file" type="file" onChange={handleFileChange} />
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={handleDueDateChange}
                  placeholder="Select due date"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClassCards;

// now if the schema was
//   classes: [
//     {
//       class: "C2",
//       div: "C21",
//       note: [
//         {
//           dueDate: "2024-08-30",
//           url: ""
//         }
//       ],
//       year: "2026"
//     }
//   ]

//   then after submitting the solution then the schema will become

//   classes: [
//     {
//       class: "C2",
//       div: "C21",
//       note: [
//         {
//           dueDate: "2024-08-30",
//           url: "",
//           submission: [
//             {
//               studUID: "",
//               url: ""
//             }
//           ]
//         }
//       ],
//       year: "2026"
//     }
//   ]
