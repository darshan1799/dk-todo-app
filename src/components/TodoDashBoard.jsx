import { QueryClient, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaSearch,
  FaPlus,
  FaCheckCircle,
  FaRegCircle,
  FaStickyNote,
  FaExclamationTriangle,
  FaTrash,
} from "react-icons/fa";

const TodoDashboard = ({ todosData, date, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTimeOfDay, setFilterTimeOfDay] = useState("all");
  const [sortBy, setSortBy] = useState("plannedDate");
  const [todos, setTodos] = useState([]);

  const toggleComplete = async (id, completed) => {
    const res = await fetch("/api/task", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    const resData = await res.json();
    if (res.ok) {
      toast.success(resData.message || "task updated");
      onUpdate();
    } else {
      toast.error(resData.error || "something wents wrong!");
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/task/${id}`, { method: "DELETE" });
    const resMsg = await res.json();
    if (res.ok) {
      onUpdate();
      toast.success(resMsg.message || "Task Deleted!");
    } else {
      toast.error(resMsg.error || "Try again");
    }
  };

  useEffect(() => {
    setTodos(todosData);
  }, [todosData]);

  const filteredAndSortedTodos = useMemo(() => {
    let filtered =
      todos?.filter((todo) => {
        const matchesSearch =
          todo.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.note.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "completed" && todo.completed) ||
          (filterStatus === "pending" && !todo.completed);
        const matchesTimeOfDay =
          filterTimeOfDay === "all" || todo?.timeOfDay === filterTimeOfDay;

        return matchesSearch && matchesStatus && matchesTimeOfDay;
      }) || [];

    return filtered?.sort((a, b) => {
      switch (sortBy) {
        case "plannedDate":
          return new Date(a.plannedDate) - new Date(b.plannedDate);
        case "createdAt":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "task":
          return a.task.localeCompare(b.task);
        case "hours":
          return parseInt(b.hours || 0) - parseInt(a.hours || 0);
        default:
          return 0;
      }
    });
  }, [todos, searchTerm, filterStatus, filterTimeOfDay, sortBy]);

  const stats = useMemo(() => {
    const completed = todos?.filter((t) => t.completed).length || 0;
    const pending = todos?.length - completed || 0;
    const totalHours =
      todos?.reduce((sum, t) => sum + parseInt(t.hours || 0), 0) || 0;
    const todayTasks =
      todos?.filter(
        (t) => t.plannedDate === new Date().toISOString().split("T")[0]
      )?.length || 0;

    return { completed, pending, totalHours, todayTasks };
  }, [todos]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeOfDayColor = (timeOfDay) => {
    switch (timeOfDay) {
      case "Morning":
        return "bg-yellow-100 text-yellow-800";
      case "Afternoon":
        return "bg-blue-100 text-blue-800";
      case "Evening":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (plannedDate, completed) => {
    return (
      !completed && new Date(plannedDate) < new Date().setHours(0, 0, 0, 0)
    );
  };

  return (
    <div className="  pt-2 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </p>
            </div>
            <FaRegCircle className="w-6 h-6 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Hours</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalHours}
              </p>
            </div>
            <FaClock className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Today</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.todayTasks}
              </p>
            </div>
            <FaCalendarAlt className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filterTimeOfDay}
              onChange={(e) => setFilterTimeOfDay(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Times</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Sort by Created</option>
              <option value="task">Sort by Task</option>
              <option value="hours">Sort by Hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredAndSortedTodos?.map((todo) => (
          <div
            key={todo._id}
            className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
              todo.completed
                ? "border-green-200 bg-green-50"
                : isOverdue(todo.plannedDate, todo.completed)
                ? "border-red-200 bg-red-50"
                : "border-slate-200"
            }`}
          >
            <div className="p-4 md:p-6">
              {/* Task Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => toggleComplete(todo._id, todo.completed)}
                    className="flex-shrink-0 mt-1 mr-3 cursor-pointer"
                  >
                    {todo.completed ? (
                      <FaCheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <FaRegCircle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-slate-800 mb-1 ${
                        todo.completed ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {todo.task}
                    </h3>
                    {todo.note && (
                      <div className="flex items-start gap-2 mb-2">
                        <FaStickyNote className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600">{todo.note}</p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="flex-shrink-0 mt-1 text-red-500 hover:text-red-700 cursor-pointer"
                  title="Delete"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>

              {/* Task Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="w-4 h-4 text-slate-400" />
                    <span
                      className={`${
                        isOverdue(todo.plannedDate, todo.completed)
                          ? "text-red-600 font-medium"
                          : "text-slate-600"
                      }`}
                    >
                      {formatDate(todo.plannedDate)}
                    </span>
                  </div>
                  {todo.hours && (
                    <div className="flex items-center gap-1">
                      <FaClock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{todo.hours}h</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  {todo.timeOfDay && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeOfDayColor(
                        todo.timeOfDay
                      )}`}
                    >
                      {todo.timeOfDay}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <FaUser className="w-3 h-3" />
                    <span>{todo.userEmail.split("@")[0]}</span>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Created {formatDate(todo.createdAt)}</span>
                  {todo.completed && (
                    <span className="text-green-600 font-medium">
                      ✓ Completed
                    </span>
                  )}
                  {isOverdue(todo.plannedDate, todo.completed) && (
                    <span className="text-red-600 font-medium">⚠ Overdue</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedTodos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <FaSearch className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            No tasks found
          </h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      )}

      {new Date(date).setHours(0, 0, 0, 0) >=
        new Date().setHours(0, 0, 0, 0) && (
        <Link href={`/addtask?date=${date}`}>
          <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 cursor-pointer">
            <FaPlus className="w-6 h-6" />
          </button>
        </Link>
      )}
    </div>
  );
};

export default TodoDashboard;
