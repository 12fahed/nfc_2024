import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/config/firebase';// Adjust the import based on your Firebase setup
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Initialize Firestore
const db = getFirestore(app);

// Define the type for the submission data
interface Submission {
  date: string; // ISO 8601 date string
  theurl: string;
}

export function SubmissionTable() {
  const [submissions, setSubmissions] = useState<{ id: string; data: Submission }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Submission'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data() as Submission // Type assertion for document data
        }));
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Table>
      <TableCaption>A list of recent submissions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Sr No</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Document Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission, index) => (
          <TableRow key={submission.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{new Date(submission.data.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <a href={submission.data.theurl} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Submissions: {submissions.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
