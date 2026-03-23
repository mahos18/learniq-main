"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, Lightbulb, ExternalLink, BookOpen, Sparkles, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Task {
  step: number;
  title: string;
  description: string;
  hints: string[];
  resources: { label: string; url: string }[];
  completed: boolean;
}

export default function AdvancedTasksPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, [courseId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?courseId=${courseId}`);
      const data = await response.json();
      
      if (data.tasks) {
        setTasks(data.tasks.tasks || []);
        setOverallProgress(data.tasks.overallProgress || 0);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateTasks = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      
      const data = await response.json();
      setTasks(data.tasks.tasks || []);
      setOverallProgress(0);
      toast.success("Advanced tasks generated!");
    } catch (error) {
      toast.error("Failed to generate tasks");
    } finally {
      setGenerating(false);
    }
  };

  const toggleTaskCompletion = async (step: number) => {
    try {
      const response = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, step }),
      });
      
      const data = await response.json();
      setTasks(data.tasks.tasks || []);
      setOverallProgress(data.tasks.overallProgress || 0);
      
      if (data.tasks.overallProgress === 100) {
        toast.success("🎉 Amazing! You've completed all advanced tasks! 🎉");
      } else {
        toast.success("Task completed! Keep going!");
      }
    } catch (error) {
      toast.error("Failed to update task"+error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Course
        </button>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-indigo-400" size={28} />
              <h1 className="text-3xl font-bold text-white">Advanced Self-Learning Tasks</h1>
            </div>
            <p className="text-gray-400">
              Challenge yourself with these advanced tasks to deepen your understanding
            </p>
          </div>
          
          {tasks.length === 0 && (
            <button
              onClick={generateTasks}
              disabled={generating}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
            >
              <Sparkles size={18} />
              {generating ? "Generating..." : "Generate Advanced Tasks"}
            </button>
          )}
        </div>
        
        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
          <BookOpen size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Tasks Yet</h3>
          <p className="text-gray-400 mb-6">
            Generate personalized advanced tasks to continue your learning journey
          </p>
          <button
            onClick={generateTasks}
            disabled={generating}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors"
          >
            Generate Tasks
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.step}
              className={cn(
                "bg-gray-800/30 rounded-xl border transition-all duration-300",
                task.completed
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-gray-700 hover:border-indigo-500/30"
              )}
            >
              {/* Task Header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold",
                    task.completed
                      ? "bg-green-500 text-white"
                      : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  )}>
                    {task.completed ? <CheckCircle2 size={20} /> : task.step}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {task.description}
                    </p>
                    
                    {/* Expand/Collapse for Hints & Resources */}
                    <button
                      onClick={() => setExpandedTask(expandedTask === task.step ? null : task.step)}
                      className="mt-3 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Lightbulb size={14} />
                      {expandedTask === task.step ? "Hide Hints & Resources" : "Show Hints & Resources"}
                    </button>
                    
                    {/* Expanded Content */}
                    {expandedTask === task.step && (
                      <div className="mt-4 space-y-4 animate-fadeIn">
                        {/* Hints */}
                        <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/20">
                          <h4 className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                            <Lightbulb size={14} />
                            Helpful Hints
                          </h4>
                          <ul className="space-y-2">
                            {task.hints.map((hint, idx) => (
                              <li key={idx} className="text-sm text-gray-300 flex gap-2">
                                <span className="text-indigo-400">•</span>
                                {hint}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Resources */}
                        {task.resources && task.resources.length > 0 && (
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                              <ExternalLink size={14} />
                              Recommended Resources
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {task.resources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-400 hover:bg-indigo-500/20 transition-all"
                                >
                                  {resource.label}
                                  <ExternalLink size={12} />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Complete Button */}
                  <button
                    onClick={() => toggleTaskCompletion(task.step)}
                    className={cn(
                      "flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all",
                      task.completed
                        ? "bg-green-500/20 text-green-400 cursor-default"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    )}
                    disabled={task.completed}
                  >
                    {task.completed ? "Completed ✓" : "Mark Complete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Completion Celebration */}
      {overallProgress === 100 && tasks.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 text-center">
          <Award size={48} className="text-amber-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Mastery Achieved! 🎉</h3>
          <p className="text-gray-300">
            You've completed all advanced tasks! You're now ready to take on real-world challenges.
          </p>
          <button
            onClick={() => router.push("/student/dashboard")}
            className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}