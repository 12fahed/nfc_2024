"use client"

import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Pie, PieChart, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

const db = getFirestore();

// Define a set of colors
const colors = [
  "#FF6347", // Tomato
  "#4682B4", // SteelBlue
  "#32CD32", // LimeGreen
  "#FFD700", // Gold
  "#6A5ACD", // SlateBlue
  "#FF4500", // OrangeRed
  "#8A2BE2", // BlueViolet
];

async function fetchAttendanceData(userId: string) {
  const docRef = doc(db, "Students", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Student Data: ", data);
    return data.attend || {}; // Return as an object
  } else {
    console.error("No such document!");
    return {};
  }
}

export function AttendanceChart({ userId }: { userId: string }) {
  const [chartData, setChartData] = useState<{ subject: string; attendance: number; fill: string }[]>([]);

  useEffect(() => {
    async function getData() {
      const data = await fetchAttendanceData(userId);
      const formattedData = Object.keys(data).map((subject, index) => ({
        subject: subject,
        attendance: parseFloat(data[subject]), // Convert attendance from string to number
        fill: colors[index % colors.length] // Assign color based on index
      }));
      setChartData(formattedData);
    }
  
    getData();
  }, [userId]);

  const chartConfig = {
    attendance: {
      label: "Attendance",
    },
    // Colors are now dynamically assigned
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Attendance Pie Chart</CardTitle>
        <CardDescription>Attendance data for the current semester</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="attendance"
              nameKey="subject"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({ outerRadius = 0, ...props }) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
              fill={(entry:any) => entry.fill} // Use color from data
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing attendance for the current semester
        </div>
      </CardFooter> */}
    </Card>
  );
}
