"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "next-themes";
import ProtectionProvider from "@/providers/ProtectionProvider";
import { useUser } from "@/providers/UserProvider";

export default function Home({
  student,
  teacher,
  admin,
}: {
  admin: React.ReactNode;
  student: React.ReactNode;
  teacher: React.ReactNode;
}) {
  const { theme } = useTheme();
  const { user } = useUser();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    console.log("User: ", user);
    const fetchUserType = async ({ uid }: { uid: string }) => {
      if (!uid) return;

      let docRef = doc(db, "Admins", uid);
      let docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserType("admin");
      } else {
        docRef = doc(db, "Teachers", uid);
        docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserType("teacher");
        } else {
          docRef = doc(db, "Students", uid);
          docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserType("student");
          }
        }
      }
    };

    fetchUserType({ uid: user?.uid || "" });
  }, [user]);

  // Log userType whenever it changes
  useEffect(() => {
    if (userType) {
      console.log("User Type: ", userType);
    }
  }, [userType]);

  return (
    <ProtectionProvider>
      <div className={`min-h-screen w-full ${theme}`}>
        <div className="flex flex-col mt-4">
          {userType === "admin" && admin}
          {userType === "student" && student}
          {userType === "teacher" && teacher}
        </div>
      </div>
    </ProtectionProvider>
  );
}