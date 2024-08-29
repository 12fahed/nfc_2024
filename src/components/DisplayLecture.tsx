"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { db, auth } from "@/config/firebase";

interface LectureData {
  class: string;
  div: string;
  year: string;
  time: string;
  date: string;
  lectureName: string; // Added lectureName field
}

const LectureCards = () => {
  const [user] = useAuthState(auth);
  const [lectures, setLectures] = useState<LectureData[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<LectureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!user) return;

      const userDocRef = doc(db, "Lecture", user.uid);

      try {
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setLectures(data.lecture || []);
        } else {
          setLectures([]);
        }
      } catch (error) {
        console.error("Error fetching lectures: ", error);
      }
    };

    fetchLectures();
  }, [user]);

  const openModal = (lectureItem: LectureData) => {
    setSelectedLecture(lectureItem);
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {lectures.map((lectureItem, index) => (
        <Card key={index} className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>{lectureItem.lectureName}</CardTitle> {/* Updated to display lectureName */}
          </CardHeader>
          <CardContent>
            <CardDescription>
              <p><strong>Class:</strong> {lectureItem.class}</p>
              <p><strong>Year:</strong> {lectureItem.year}</p>
              <p><strong>Division:</strong> {lectureItem.div}</p>
              <p><strong>Time:</strong> {lectureItem.time}</p>
              <p><strong>Date:</strong> {lectureItem.date}</p>
              <Button variant="outline" onClick={() => openModal(lectureItem)}>
                View Details
              </Button>
            </CardDescription>
          </CardContent>
        </Card>
      ))}

      {selectedLecture && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedLecture.lectureName}</DialogTitle> {/* Updated to display lectureName */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p><strong>Class:</strong> {selectedLecture.class}</p>
              <p><strong>Year:</strong> {selectedLecture.year}</p>
              <p><strong>Division:</strong> {selectedLecture.div}</p>
              <p><strong>Time:</strong> {selectedLecture.time}</p>
              <p><strong>Date:</strong> {selectedLecture.date}</p>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LectureCards;
