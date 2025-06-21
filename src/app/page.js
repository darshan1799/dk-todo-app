"use client";
import DateSlider from "@/components/DateSlider";
import Loader from "@/components/Loader";
import TodoDashboard from "@/components/TodoDashBoard";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaPlusCircle } from "react-icons/fa";

export default function Home() {
  const { data: session, status } = useSession();
  const [date, setDate] = useState(new Date());
  const router = useRouter();
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function fetchData() {
    const res = await fetch(`/api/task?date=${date}`);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "something wents wrong!");
    }
    return data;
  }
  const { data, refetch } = useQuery({
    queryKey: ["fetchtaskData", date],
    queryFn: fetchData,
  });

  if (status == "loading" || status == "unauthenticated") {
    return <Loader />;
  }
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen ">
        <div className="mt-3 flex justify-center items-center flex-col gap-2">
          <DateSlider setDate={setDate} />
          <TodoDashboard
            todosData={data}
            date={date}
            onUpdate={refetch}
          ></TodoDashboard>
        </div>
      </div>
    </>
  );
}
