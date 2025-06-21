"use client";

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";

const taskSchema = Yup.object({
  task: Yup.string().required("Task is required"),
  note: Yup.string(),
  timeOfDay: Yup.string().required("Time is required"),
  hours: Yup.number()
    .min(0, "Hours must be positive")
    .max(24, "Hours cannot exceed 24")
    .required("Hours is required"),
});

export function TaskForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  async function postData(data) {
    const res = await fetch("/api/task", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify(data),
    });
    const finalRes = await res.json();
    if (res.ok) {
      toast.success(finalRes.message || "Task created successfully!");
      router.back();
    } else {
      toast.error(finalRes.error || "Failed to create task");
    }
  }

  const mutation = useMutation({
    mutationKey: "createTask",
    mutationFn: postData,
  });
  const params = useSearchParams();

  const initialDate = useMemo(() => {
    const date = params.get("date");
    return date
      ? new Date(date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
  }, [params]);

  const { values, handleSubmit, handleBlur, handleChange, errors, touched } =
    useFormik({
      initialValues: {
        task: "",
        note: "",
        timeOfDay: "",
        hours: "",
        plannedDate: initialDate,
      },
      validationSchema: taskSchema,
      onSubmit: async (data) => {
        data.userEmail = session.user.email;

        if (!params.get("date")) {
          await toast.error("You can't add task directly!");
        } else {
          if (!data.plannedDate) {
            data.plannedDate = initialDate;
          }
          mutation.mutate(data);
        }
      },
    });
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/login");
    }
  }, [session]);
  if (status == "unauthenticated" || status == "loading") {
    return <Loader />;
  }

  return (
    <>
      <form
        action=""
        className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8 space-y-6 backdrop-blur-sm"
        onSubmit={handleSubmit}
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Task</h1>
          <p className="text-gray-500 text-sm">Plan your day efficiently</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Task <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your task"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            name="task"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.task}
          />
          {touched.task && errors.task && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.task}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Note (Optional)
          </label>
          <textarea
            placeholder="Add any additional notes"
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
            name="note"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.note}
          />
          {touched.note && errors.note && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.note}
            </p>
          )}
        </div>

        {/* Time of Day and Hours Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Time of Day Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Time of Day <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              name="timeOfDay"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.timeOfDay}
            >
              <option value="">Select time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
            {touched.timeOfDay && errors.timeOfDay && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.timeOfDay}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Hours <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              name="hours"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.hours}
            />
            {touched.hours && errors.hours && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.hours}
              </p>
            )}
          </div>
        </div>
        <button
          disabled={mutation.isPending}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 cursor-pointer ${
            mutation.isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
          }`}
          type="submit"
        >
          {mutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Task...
            </div>
          ) : (
            "Create Task"
          )}
        </button>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Want to view your tasks?{" "}
            <Link
              href="/"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Go to Tasks
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default function addTask() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex justify-center items-center p-4">
        <div className="w-full max-w-md">
          <Suspense fallback={<Loader />}>
            <TaskForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
