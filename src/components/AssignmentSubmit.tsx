"use client"

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

// Define the type for a submission
interface Submission {
  date: string; // Assuming date is in ISO format (yyyy-mm-dd)
  url: string;
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function SubmissionsTable() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const submissionsCollection = collection(db, "Submission");
        const submissionSnapshot = await getDocs(submissionsCollection);
        const submissionList: Submission[] = submissionSnapshot.docs.map(doc => doc.data() as Submission);
        setSubmissions(submissionList);
      } catch (error) {
        console.error("Error fetching submissions: ", error);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <Table>
      {/* <TableCaption>A list of submissions and their file URLs.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>File URL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission, index) => (
          <TableRow key={index}>
            <TableCell>{formatDate(submission.date)}</TableCell>
            <TableCell>
              <a href={submission.url} target="_blank" rel="noopener noreferrer">
                View
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
