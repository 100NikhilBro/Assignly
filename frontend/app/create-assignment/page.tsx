"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../store/userStore";
import Header from "@/components/layout/Header";
import toast from "react-hot-toast";
import { 
  Plus, 
  X, 
  Star, 
  Loader2, 
  AlertCircle,
  BookOpen,
  Target,
  Sparkles,
  Clock,
  Calendar,
  School,
  GraduationCap,
  BookMarked,
  ListChecks,
  Lightbulb,
  CheckCircle,
  FileText,
  Hash,
  Type,
  ChevronLeft,
  ShieldAlert,
  Zap
} from "lucide-react";

// Types
interface AssignmentForm {
  schoolName: string;
  class: string;
  subject: string;
  topic: string;
  totalMarks: number;
  timeAllowed: string;
  dueDate: string;
  instructions: string;
  concepts: string[];
  difficultyLevel: "easy" | "balanced" | "tough";
  questionTypes: string[];
  includeHints: boolean;
  includeAnswers: boolean;
  ensurePassing: boolean;
}

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy", description: "Basic conceptual questions", icon: BookOpen },
  { value: "balanced", label: "Balanced", description: "Mix of easy and tough", icon: Target },
  { value: "tough", label: "Tough", description: "Advanced analytical questions", icon: Zap }
];

const QUESTION_TYPES = [
  { value: "short", label: "Short Answer", icon: FileText },
  { value: "long", label: "Long Answer", icon: BookMarked },
  { value: "multiple choice", label: "MCQ", icon: ListChecks },
  { value: "fill in blanks", label: "Fill in Blanks", icon: Type },
  { value: "true false", label: "True/False", icon: CheckCircle }
];

// Helper: Get or create guest session ID
const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem("guest_session_id");
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("guest_session_id", sessionId);
  }
  return sessionId;
};

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { user, updateCredits } = useUserStore();
  const { isAuthenticated, token } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conceptInput, setConceptInput] = useState("");
  const [guestCredits, setGuestCredits] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showHackTooltip, setShowHackTooltip] = useState(false);
  
  const [form, setForm] = useState<AssignmentForm>({
    schoolName: "",
    class: "",
    subject: "",
    topic: "",
    totalMarks: 50,
    timeAllowed: "45 minutes",
    dueDate: "",
    instructions: "Attempt all questions. Write clearly and concisely.",
    concepts: [],
    difficultyLevel: "balanced",
    questionTypes: ["short", "long"],
    includeHints: false,
    includeAnswers: false,
    ensurePassing: true,
  });

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch guest credits on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const fetchGuestCredits = async () => {
        try {
          const sessionId = getOrCreateSessionId();
          if (!sessionId) return;
          
          const cachedCredits = localStorage.getItem("guestCredits");
          if (cachedCredits !== null && !isNaN(parseInt(cachedCredits))) {
            const credits = parseInt(cachedCredits);
            setGuestCredits(credits);
            return;
          }
          
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/guest/credits`,
            { headers: { "x-session-id": sessionId } }
          );
          
          setGuestCredits(response.data.credits);
          localStorage.setItem("guestCredits", response.data.credits.toString());
          
        } catch (err) {
          // console.error("Failed to fetch guest credits:", err);
          const fallbackCredits = localStorage.getItem("guestCredits");
          if (fallbackCredits) {
            setGuestCredits(parseInt(fallbackCredits));
          } else {
            setGuestCredits(3);
            localStorage.setItem("guestCredits", "3");
          }
        }
      };
      fetchGuestCredits();
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleQuestionTypeToggle = (typeValue: string) => {
    // Hide MCQ option - don't allow toggling for MCQ
    if (typeValue === "multiple choice") return;
    
    setForm(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(typeValue)
        ? prev.questionTypes.filter(t => t !== typeValue)
        : [...prev.questionTypes, typeValue]
    }));
  };

  const addConcept = () => {
    if (conceptInput.trim() && !form.concepts.includes(conceptInput.trim())) {
      setForm(prev => ({
        ...prev,
        concepts: [...prev.concepts, conceptInput.trim()]
      }));
      setConceptInput("");
    }
  };

  const removeConcept = (concept: string) => {
    setForm(prev => ({
      ...prev,
      concepts: prev.concepts.filter(c => c !== concept)
    }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.class || !form.subject || !form.topic || !form.totalMarks) {
      setError("Please fill all required fields");
      toast.error("Please fill all required fields");
      return;
    }

    if (form.totalMarks < 10 || form.totalMarks > 200) {
      setError("Total marks should be between 10 and 200");
      toast.error("Total marks should be between 10 and 200");
      return;
    }

    if (!isAuthenticated) {
      const credits = guestCredits !== null ? guestCredits : 3;
      if (credits <= 0) {
        setError("Guest credits exhausted. Please login to continue.");
        toast.error("Guest credits exhausted. Please login to continue.");
        return;
      }
    } else if (user && user.credits <= 0) {
      setError("No credits left. Please upgrade to continue.");
      toast.error("No credits left. Please upgrade to continue.");
      return;
    }

    try {
      setLoading(true);

      const sessionId = !isAuthenticated ? getOrCreateSessionId() : undefined;

      let formattedDueDate = undefined;
      if (form.dueDate) {
        try {
          const date = new Date(form.dueDate);
          if (!isNaN(date.getTime())) {
            formattedDueDate = date.toISOString();
          }
        } catch (e) {
          console.error("Invalid date format:", form.dueDate);
        }
      }

      const payload = {
        schoolName: form.schoolName || undefined,
        class: form.class,
        subject: form.subject,
        topic: form.topic,
        totalMarks: form.totalMarks,
        timeAllowed: form.timeAllowed,
        dueDate: formattedDueDate,
        instructions: form.instructions,
        concepts: form.concepts,
        difficultyLevel: form.difficultyLevel,
        questionTypes: form.questionTypes,
        includeHints: form.includeHints,
        includeAnswers: form.includeAnswers,
        ensurePassing: form.ensurePassing,
      };

      const headers: any = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      if (sessionId) {
        headers["x-session-id"] = sessionId;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/assignment`,
        payload,
        { headers }
      );

      const { id } = response.data.data;

      if (user) {
        updateCredits(user.credits - 1);
      } else if (guestCredits !== null) {
        const newCredits = guestCredits - 1;
        setGuestCredits(newCredits);
        localStorage.setItem("guestCredits", newCredits.toString());
      }

      toast.success("Assignment created! Redirecting...");
      router.push(`/assignment/${id}`);

    } catch (err: any) {
      console.error("Create assignment error:", err);
      const errorMsg = err?.response?.data?.message || "Failed to create assignment";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCredits = () => {
    if (user) return user.credits;
    if (guestCredits !== null) return guestCredits;
    return 3;
  };

  return (
    <div className="relative min-h-screen bg-[#fdfaf5] overflow-x-hidden">
      {/* Background Grid - Responsive pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem]" />
      
      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />

      <Header />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Back Button - Mobile */}
        <button
          onClick={() => router.back()}
          className="md:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border border-amber-100">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            <span className="text-xs sm:text-sm text-amber-700 font-medium">Create New Assignment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Create Assignment
          </h1>
          <p className="text-sm sm:text-base text-gray-500 px-2">
            Fill in the details below to generate an AI-powered exam paper
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-600 p-3 sm:p-4 rounded-xl flex items-start sm:items-center gap-2 text-sm sm:text-base">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-amber-100 p-4 sm:p-6 md:p-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Info Grid - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  name="schoolName"
                  placeholder="School Name (Optional)"
                  value={form.schoolName}
                  onChange={handleChange}
                  className="w-full bg-[#fdfaf5] border border-amber-200 rounded-xl pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  name="class"
                  placeholder="Class *"
                  value={form.class}
                  onChange={handleChange}
                  className="w-full bg-[#fdfaf5] border border-amber-200 rounded-xl pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  name="subject"
                  placeholder="Subject *"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-[#fdfaf5] border border-amber-200 rounded-xl pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
              <div className="relative">
                <BookMarked className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  name="topic"
                  placeholder="Topic *"
                  value={form.topic}
                  onChange={handleChange}
                  className="w-full bg-[#fdfaf5] border border-amber-200 rounded-xl pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
              
              {/* Total Marks with Hack Tooltip */}
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  name="totalMarks"
                  type="number"
                  placeholder="Total Marks * (10-200)"
                  value={form.totalMarks}
                  onChange={handleChange}
                  min={10}
                  max={200}
                  className="w-full bg-[#fdfaf5] border border-amber-200 rounded-xl pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
                {/* Hack Tooltip - Desktop Only */}
                <div className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2">
                  <div 
                    className="relative"
                    onMouseEnter={() => setShowHackTooltip(true)}
                    onMouseLeave={() => setShowHackTooltip(false)}
                  >
                    <ShieldAlert className="w-4 h-4 text-gray-400 cursor-help hover:text-amber-500 transition-colors" />
                    {showHackTooltip && (
                      <div className="absolute right-0 bottom-full mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 z-50 shadow-lg border border-gray-700">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <p className="font-semibold text-amber-400 text-xs">Pro Hack</p>
                        </div>
                        <p className="mb-1 leading-relaxed">
                          Set total marks higher than your actual requirement. Then use the <span className="font-mono bg-gray-800 px-1 rounded text-amber-300">"Attempt X"</span> option on the assignment page to select specific questions and get exactly the marks you need!
                        </p>
                        <p className="text-gray-400 text-[10px] mt-1">Example: Set 60 marks → attempt 30 marks worth questions → Get 30 marks paper</p>
                        <div className="absolute right-2 -bottom-1 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  name="timeAllowed"
                  placeholder="Time Allowed (e.g., 45 minutes)"
                  value={form.timeAllowed}
                  onChange={handleChange}
                  className="w-full bg-[#fdfaf5] border border-amber-200 rounded-xl pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
              <div className="relative sm:col-span-2">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  name="dueDate"
                  type="datetime-local"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full bg-[#fdfaf5] border border-amber-200 rounded-xl pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Concepts Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Key Concepts
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={conceptInput}
                  onChange={(e) => setConceptInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addConcept()}
                  placeholder="Add concepts (e.g., Photosynthesis, Algebra)"
                  className="flex-1 bg-[#fdfaf5] border border-amber-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  onClick={addConcept}
                  className="px-4 py-2.5 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="bg-amber-50 text-amber-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 border border-amber-200"
                  >
                    <span className="truncate max-w-[120px] sm:max-w-none">{concept}</span>
                    <button
                      onClick={() => removeConcept(concept)}
                      className="hover:text-amber-900 flex-shrink-0"
                    >
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Instructions
              </label>
              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                rows={isMobile ? 2 : 3}
                className="w-full bg-[#fdfaf5] border border-amber-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Difficulty Level - Responsive grid */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-600" />
                Difficulty Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setForm(prev => ({ ...prev, difficultyLevel: opt.value as any }))}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition text-left ${
                      form.difficultyLevel === opt.value
                        ? "border-amber-500 bg-amber-50"
                        : "border-amber-200 hover:border-amber-300 bg-[#fdfaf5]"
                    }`}
                  >
                    <opt.icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2 ${form.difficultyLevel === opt.value ? "text-amber-600" : "text-amber-500"}`} />
                    <div className="font-medium text-gray-900 text-sm sm:text-base">{opt.label}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Types - Hide MCQ */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-amber-600" />
                Question Types
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {QUESTION_TYPES.map((type) => {
                  // Hide MCQ option completely
                  if (type.value === "multiple choice") return null;
                  
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleQuestionTypeToggle(type.value)}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-1.5 sm:gap-2 ${
                        form.questionTypes.includes(type.value)
                          ? "bg-amber-600 text-white"
                          : "bg-amber-50 text-gray-600 hover:bg-amber-100 border border-amber-200"
                      }`}
                    >
                      <type.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden xs:inline">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Options - Hide Include answer key */}
            <div className="space-y-2.5 sm:space-y-3">
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="includeHints"
                  checked={form.includeHints}
                  onChange={handleCheckboxChange}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                />
                <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-xs sm:text-sm text-gray-700">Include hints for tough questions</span>
              </label>
              
              {/* Include answer key - Hidden completely */}
              {/* <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="includeAnswers"
                  checked={form.includeAnswers}
                  onChange={handleCheckboxChange}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                />
                <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-xs sm:text-sm text-gray-700">Include answer key</span>
              </label> */}
              
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="ensurePassing"
                  checked={form.ensurePassing}
                  onChange={handleCheckboxChange}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                />
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-xs sm:text-sm text-gray-700">Ensure passing marks distribution</span>
              </label>
            </div>

            {/* Credit Info - Responsive */}
            <div className="bg-gradient-to-r from-amber-50/80 to-amber-100/50 p-3 sm:p-4 rounded-xl border border-amber-200 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  <span className="text-sm sm:text-base text-gray-700">Credits remaining:</span>
                  <span className="text-xl sm:text-2xl font-bold text-amber-700">{getCurrentCredits()}</span>
                </div>
                {!user && (
                  <button
                    onClick={() => router.push("/login")}
                    className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium w-full sm:w-auto text-center"
                  >
                    Login for 30 credits →
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || getCurrentCredits() <= 0}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Generating Assignment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Create Assignment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
