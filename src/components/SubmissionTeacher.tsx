"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Adjust the import path as needed

type Student = {
  id: string;
  name: string;
};

type Submission = {
  date: string;
  url: string;
};

export function SubmissionTable() {
  const [submissions, setSubmissions] = useState<{ name: string; date: string; url: string }[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const submissionsCollection = collection(db, 'Submission');
        const submissionsSnapshot = await getDocs(submissionsCollection);

        // Fetch all student IDs
        const studentIds = submissionsSnapshot.docs.map(doc => doc.id);

        // Fetch student names
        const students = await Promise.all(
          studentIds.map(async (id) => {
            const studentDoc = doc(db, 'Students', id);
            const studentSnapshot = await getDoc(studentDoc);
            return {
              id,
              name: studentSnapshot.exists() ? (studentSnapshot.data() as Student).name : 'Unknown'
            };
          })
        );

        // Create a map of student IDs to names
        const studentMap = new Map<string, string>(students.map(student => [student.id, student.name]));

        // Map submissions to include student names
        const submissionList = submissionsSnapshot.docs.map(doc => {
          const data = doc.data() as Submission;
          return {
            name: studentMap.get(doc.id) || 'Unknown',
            date: data.date,
            url: data.url
          };
        });

        setSubmissions(submissionList);
      } catch (error) {
        console.error('Error fetching submissions: ', error);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <Table>
      <TableCaption>Student Submissions</TableCaption>
      <TableHead>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>URL</TableHead>
          </TableRow>
        </TableHeader>
      </TableHead>
      <TableBody>
        {submissions.map((submission, index) => (
          <TableRow key={index}>
            <TableCell>{submission.name}</TableCell>
            <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <a href={submission.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                View Submission
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {/* Optional footer content */}
      </TableFooter>
    </Table>
  );
}
