import React, { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
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
import * as XLSX from 'xlsx'; // Import the xlsx library

// Define the Student type
type Student = {
  id: string;
  roll_no: string;
  name: string;
  class: string;
  div: string;
  year: string;
  attend?: Record<string, string>; // Optional, adjust as needed
};

export function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceKeys, setAttendanceKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(db, "Students");
        const studentsSnapshot = await getDocs(studentsCollection);
        const studentsList: Student[] = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Student, 'id'>),
        }));

        // Determine unique attendance keys
        const keys = Array.from(
          new Set(studentsList.flatMap(student => Object.keys(student.attend || {})))
        );

        setStudents(studentsList);
        setAttendanceKeys(keys);
      } catch (error) {
        console.error("Error fetching students: ", error);
      }
    };

    fetchStudents();
  }, []);

  const exportToExcel = () => {
    // Create a worksheet from the table data
    const wsData = [
      ['Roll No', 'Name', 'Class', 'Div', 'Year', ...attendanceKeys], // Table headers
      ...students.map(student => [
        student.roll_no,
        student.name,
        student.class,
        student.div,
        student.year,
        ...attendanceKeys.map(key => student.attend?.[key] || '-')
      ]) // Table rows
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Attendance");

    // Generate Excel file and prompt download
    XLSX.writeFile(wb, "Student_Attendance.xlsx");
  };

  return (
    <div>
      <Table>
        <TableCaption>Student Attendance Records</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Roll No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Div</TableHead>
            <TableHead>Year</TableHead>
            {attendanceKeys.map(key => (
              <TableHead key={key}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.roll_no}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{student.div}</TableCell>
              <TableCell>{student.year}</TableCell>
              {attendanceKeys.map(key => (
                <TableCell key={key}>{student.attend?.[key] || '-'}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total Students</TableCell>
            <TableCell colSpan={attendanceKeys.length}>{students.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <button onClick={exportToExcel} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Export to Excel
      </button>
    </div>
  );
}
