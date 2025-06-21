"use client";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function DateSlider({ setDate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 1);

  const handlePrevDay = () => {
    const prevdate = new Date(selectedDate);
    prevdate.setDate(selectedDate.getDate() - 1);
    if (prevdate >= startDate) setSelectedDate(prevdate);
  };
  const handleNextDay = () => {
    const prevdate = new Date(selectedDate);
    prevdate.setDate(selectedDate.getDate() + 1);
    if (prevdate <= endDate) setSelectedDate(prevdate);
  };
  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  return (
    <>
      <div className="inline-flex items-center gap-4 bg-blue-50 px-6 py-4 rounded-lg">
        <button
          onClick={handlePrevDay}
          className="p-2 hover:bg-blue-100 rounded-full transition-colors cursor-pointer"
          disabled={selectedDate <= startDate}
        >
          <FaChevronLeft
            className={`w-5 h-5 ${
              selectedDate <= startDate ? "text-gray-400" : "text-blue-600"
            }`}
          />
        </button>

        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {selectedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-sm text-gray-600">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <button
          onClick={handleNextDay}
          className="p-2 hover:bg-blue-100 rounded-full transition-colors cursor-pointer"
          disabled={selectedDate >= endDate}
        >
          <FaChevronRight
            className={`w-5 h-5 ${
              selectedDate >= endDate ? "text-gray-400" : "text-blue-600"
            }`}
          />
        </button>
      </div>
    </>
  );
}
