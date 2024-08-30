"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import styles from './TecherCard.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface StudentData {
  name: string;
  class: string;
  div: string;
  email: string;
  roll_no: string;
  year: string;
}

interface NoteEntry {
  dueDate: string;
  url: string;
}

interface ClassEntry {
  class: string;
  div: string;
  year: string;
  notes: NoteEntry[];
}

interface ClassData {
  classes: ClassEntry[];
}

export default function Student() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [classData, setClassData] = useState<ClassEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [noteURL, setNoteURL] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [view, setView] = useState('assignments'); // Default view
  const router = useRouter();

  useEffect(() => {
    const fetchStudentData = async () => {
      const user = localStorage.getItem('user');
      
      if (!user) {
        setError(new Error('No user data found in localStorage'));
        setLoading(false);
        return;
      }

      try {
        const userObj = JSON.parse(user);
        const userId = userObj.uid;

        if (!userId) {
          throw new Error('No user ID found in localStorage');
        }

        const docRef = doc(db, 'Students', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as StudentData;
          setStudentData(data);
          fetchClassData(data.class, data.div, data.year);
        } else {
          throw new Error("No student document found!");
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    const fetchClassData = async (studentClass: string, studentDiv: string, studentYear: string) => {
      try {
        const docRef = doc(db, 'Class', 'yFuUwl0rHYVI6VRsdWsNiVJmDoM2'); // Replace with dynamic ID if needed
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ClassData;
          const matchingClass = data.classes.find((entry) =>
            entry.class === studentClass &&
            entry.div === studentDiv &&
            entry.year === studentYear
          );

          if (matchingClass) {
            setClassData(matchingClass);
          } else {
            throw new Error("No matching class found!");
          }
        } else {
          throw new Error("No class document found!");
        }
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchStudentData();
  }, []);

  const handleNoteClick = async (url: string) => {
    setSelectedNote(url);
    
    try {
      const downloadURL = await getDownloadURL(ref(storage, url));
      setNoteURL(downloadURL);
    } catch (err) {
      setError(err as Error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!file || !studentData) return; // Ensure all required data is present
  
    const userId = JSON.parse(localStorage.getItem('user') || '{}').uid;
    const fileRef = ref(storage, `assignments/${userId}/${file.name}`);
    const submissionDate = new Date().toISOString(); // Get the current date and time
  
    try {
      // Upload the file
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);
  
      // Create or update the document with the userId as the document ID
      const submissionDocRef = doc(db, 'Submission', userId);
      await setDoc(submissionDocRef, {
        date: submissionDate,
        url: fileURL
      });
  
      alert('Assignment submitted successfully!');
    } catch (err) {
      console.error('Error uploading file: ', err);
      setError(err as Error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Adjust key as needed
    router.push("/"); // Redirect to home or login page
  };

  const renderView = () => {
    if (view === 'assignments') {
      return (
        <div>
          {classData ? (
            classData.notes.length > 0 ? (
              <ul>
                {classData.notes.map((note, index) => (
                  <li key={index}>
                    <Dialog>
                      <p><strong>Class: {classData.class}</strong></p>
                      <DialogTrigger asChild>
                        <Button onClick={() => handleNoteClick(note.url)}>View Assignment (Due: {note.dueDate})</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[1000px]">
                        <DialogHeader>
                          <DialogTitle>Assignment</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          {noteURL ? (
                            <iframe src={noteURL} width="100%" height="400px" title="Note"></iframe>
                          ) : (
                            <p>Loading file...</p>
                          )}
                          <input type="file" onChange={handleFileChange} />
                          <Button onClick={handleSubmitAssignment} disabled={!file}>
                            Submit Assignment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No assignments available for this class.</p>
            )
          ) : (
            <p>No class data found</p>
          )}
        </div>
      );
    }
    return <div>View not available</div>; // Default or other views if needed
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-800">Student Dashboard</h1>
        <Button 
          onClick={handleLogout} 
          className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
        >
          Logout
        </Button>
      </header>
      <nav className="bg-white p-4 shadow-inner flex justify-center space-x-8 mb-6">
        <Button
          onClick={() => setView('assignments')}
          className={`px-6 py-2 rounded-full ${
            view === 'assignments'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Assignments
        </Button>
        {/* Add other buttons for different views if necessary */}
      </nav>
      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
