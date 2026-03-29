

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/layout/Header";
import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
import { printPDF } from "../../lib/printPdf";
import { useUserStore } from "../../store/userStore";
import { Printer, PlusCircle, XCircle, RefreshCw, Loader2, CreditCard, Eye, EyeOff, Settings, ChevronDown, ChevronUp, X } from "lucide-react";
import toast from "react-hot-toast";

type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

interface Option {
  text: string;
  isCorrect?: boolean;
}

interface Question {
  number: number;
  text: string;
  type: string;
  difficulty: string;
  marks: number;
  hint?: string;
  options?: Option[];
  blanks?: string[];
}

interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

interface Assignment {
  _id: string;
  schoolName?: string;
  class: string;
  subject: string;
  topic: string;
  totalMarks: number;
  timeAllowed: string;
  instructions: string;
  status: AssignmentStatus;
  paper?: {
    instructions: string;
    sections: Section[];
    studentInfo?: {
      name: string;
      rollNumber: string;
      section: string;
      class: string;
      subject: string;
      date: string;
    };
  };
  errorMessage?: string;
}

export default function AssignmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token, updateCredits } = useUserStore();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [socketError, setSocketError] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedMCQs, setExpandedMCQs] = useState<Set<string>>(new Set());
  const [sectionAttempts, setSectionAttempts] = useState<Record<string, number>>({});
  const [tempAttempts, setTempAttempts] = useState<Record<string, string>>({});
  
  const pdfRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const fetchAssignment = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
      );

      const data = response.data.data;
      setAssignment(data);
      
      // Initialize attempts for each section (default to total questions)
      if (data.paper?.sections) {
        const initialAttempts: Record<string, number> = {};
        const initialTemp: Record<string, string> = {};
        data.paper.sections.forEach((section: Section) => {
          const total = section.questions?.length || 0;
          initialAttempts[section.title] = total;
          initialTemp[section.title] = String(total);
        });
        setSectionAttempts(initialAttempts);
        setTempAttempts(initialTemp);
      }

      switch (data.status) {
        case "pending":
          setStatusMessage("Assignment is queued. Waiting for processing...");
          break;
        case "processing":
          setStatusMessage("AI is generating your assignment. This may take 30-60 seconds...");
          break;
        case "completed":
          setStatusMessage("Assignment ready!");
          setLoading(false);
          setIsRegenerating(false);
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          break;
        case "failed":
          setStatusMessage(`Failed: ${data.errorMessage || "Unknown error"}`);
          setLoading(false);
          setIsRegenerating(false);
          break;
      }

      if (data.status !== "completed") {
        setLoading(true);
      } else {
        setLoading(false);
      }

    } catch (err: any) {
      console.error("Fetch assignment error:", err);
      if (err?.response?.status === 404) {
        setStatusMessage("Assignment not found");
      } else {
        setStatusMessage("Failed to load assignment");
      }
      setLoading(false);
      setIsRegenerating(false);
    }
  }, [id]);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
    pollIntervalRef.current = setInterval(() => {
      if (assignment?.status === "completed" || assignment?.status === "failed") {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        return;
      }
      fetchAssignment();
    }, 5000);
  }, [assignment?.status, fetchAssignment]);

  const handleRegenerate = async () => {
    if (!user) {
      toast.error("Please login to regenerate assignments");
      router.push("/login");
      return;
    }

    if (user.credits <= 0) {
      toast.error("No credits left. Please upgrade to regenerate.");
      return;
    }

    if (isRegenerating) {
      toast.error("Already regenerating. Please wait...");
      return;
    }

    try {
      setIsRegenerating(true);
      setLoading(true);
      setStatusMessage("Starting regeneration...");
      
      if (user) {
        updateCredits(user.credits - 1);
      }
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}/regenerate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Regeneration started! New paper will appear soon.");
        setStatusMessage("Regenerating assignment... This may take a moment.");
      }

    } catch (err: any) {
      console.error("Regenerate error:", err);
      const errorMsg = err?.response?.data?.message || "Failed to regenerate";
      toast.error(errorMsg);
      setIsRegenerating(false);
      setLoading(false);
      setStatusMessage("");
      
      if (user) {
        updateCredits(user.credits);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAssignment();
    
    let socket: any = null;
    let unsubscribe: (() => void) | null = null;
    
    try {
      socket = getSocket(token || undefined);
      joinAssignmentRoom(id as string, token || undefined);
      
      unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
        setSocketError(false);
        
        setAssignment((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: data.status,
            paper: data.data || prev.paper,
            errorMessage: data.error,
          };
        });

        if (data.status === "processing") {
          setStatusMessage("AI is generating your assignment...");
          setLoading(true);
          setIsRegenerating(true);
        } else if (data.status === "completed") {
          setStatusMessage("Assignment ready!");
          setLoading(false);
          setIsRegenerating(false);
          toast.success("Assignment regenerated successfully!");
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        } else if (data.status === "failed") {
          setStatusMessage(`Failed: ${data.error || "Unknown error"}`);
          setLoading(false);
          setIsRegenerating(false);
          toast.error("Regeneration failed. Please try again.");
        } else if (data.status === "ai_attempt") {
          setStatusMessage(`AI attempt ${data.attempt || 1}...`);
        } else if (data.status === "retrying") {
          setStatusMessage(`Retrying... Reason: ${data.reason || "unknown"}`);
        } else if (data.status === "switching_provider") {
          setStatusMessage(`Switching from ${data.from} to ${data.to}...`);
        }
      }, token || undefined);
      
      startPolling();
      
    } catch (err) {
      setSocketError(true);
      startPolling();
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [id, fetchAssignment, token, startPolling]);

  const handlePrint = () => {
    if (pdfRef.current) {
      // Pass section attempts data to the print function
      printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`, sectionAttempts);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchAssignment();
  };

  const toggleMCQOptions = (questionKey: string) => {
    setExpandedMCQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionKey)) {
        newSet.delete(questionKey);
      } else {
        newSet.add(questionKey);
      }
      return newSet;
    });
  };

  const handleTempAttemptChange = (sectionTitle: string, value: string) => {
    setTempAttempts(prev => ({ ...prev, [sectionTitle]: value }));
  };

  const applyAttempt = (sectionTitle: string, totalQuestions: number) => {
    const value = tempAttempts[sectionTitle];
    if (!value) {
      toast.error("Please enter a number");
      return;
    }
    
    const numAttempt = parseInt(value);
    if (isNaN(numAttempt) || numAttempt < 0) {
      toast.error("Please enter a valid number");
      return;
    }
    
    if (numAttempt > totalQuestions) {
      toast.error(`Cannot attempt more than ${totalQuestions} questions`);
      return;
    }
    
    setSectionAttempts(prev => ({ ...prev, [sectionTitle]: numAttempt }));
    toast.success(`Set to attempt ${numAttempt} out of ${totalQuestions} questions in ${sectionTitle}`);
  };

  const getSectionDescription = (title: string) => {
    if (title === "Section A") {
      return "Conceptual Understanding";
    } else if (title === "Section B") {
      return "Application Based Questions";
    } else if (title === "Section C") {
      return "Critical Thinking Questions";
    }
    return "";
  };

  const renderQuestionContent = (q: Question, questionKey: string) => {
    const isMCQ = q.type?.toLowerCase() === 'mcq' || q.type?.toLowerCase() === 'multiple choice';
    const isFillBlank = q.type?.toLowerCase() === 'fill in the blank' || q.type?.toLowerCase() === 'fill in blanks';
    const hasOptions = q.options && q.options.length > 0;
    const isExpanded = expandedMCQs.has(questionKey);
    
    let cleanText = q.text;
    cleanText = cleanText.replace(/\s*\([\d\s]+(Marks|marks)?\)/gi, '');
    cleanText = cleanText.trim();
    
    const marksText = `(${q.marks} Marks)`;
    const difficultyText = q.difficulty ? ` [${q.difficulty}]` : '';
    const marksAndDifficulty = showDifficulty 
      ? `${marksText}${difficultyText}`
      : marksText;
    
    return (
      <div>
        <p className="text-sm leading-tight">
          <span className="font-bold">{q.number}.</span>{' '}
          {cleanText}
          <span className="font-medium ml-1">
            {marksAndDifficulty}
          </span>
        </p>
        
        {isFillBlank && q.blanks && q.blanks.length > 0 && (
          <div className="mt-1 ml-5 space-y-0.5">
            {q.blanks.map((blank, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 text-xs">{idx + 1}.</span>
                <span className="border-b border-gray-400 inline-block min-w-[120px] w-full max-w-[180px]"></span>
              </div>
            ))}
          </div>
        )}
        
        {isMCQ && hasOptions && (
          <div className="mt-1 ml-5">
            <button
              onClick={() => toggleMCQOptions(questionKey)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-1 no-print"
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              <span>{isExpanded ? 'Hide' : 'Show'} Options</span>
            </button>
            
            <div className={`space-y-0.5 ${!isExpanded && 'hidden print:block'}`}>
              {q.options?.map((option, optIdx) => (
                <div key={optIdx} className="flex items-start gap-2 text-sm">
                  <span className="font-medium text-gray-600 min-w-[24px] text-xs">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span className="text-gray-700">{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {q.hint && (
          <p className="text-xs text-gray-500 mt-0.5 ml-5 hidden">
            Hint: {q.hint}
          </p>
        )}
        <div className="mt-1 ml-5 h-2"></div>
      </div>
    );
  };

  if (loading && assignment?.status !== "completed") {
    return (
      <div className="relative min-h-screen bg-[#fdfaf5]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        <Header />
        <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          </div>
          <h2 className="text-lg font-semibold mt-6 text-center text-gray-900 max-w-sm">
            {statusMessage || "Preparing your assignment..."}
          </h2>
          {socketError && (
            <p className="text-amber-600 text-xs mt-2 text-center">
              Real-time connection lost. Updates may be delayed.
            </p>
          )}
          <p className="text-gray-400 text-xs mt-4 text-center">
            Please don't close this page
          </p>
        </div>
      </div>
    );
  }

  if (assignment?.status === "failed") {
    return (
      <div className="relative min-h-screen bg-[#fdfaf5]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        <Header />
        <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="text-center w-full max-w-md mx-auto">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-amber-700 mb-2">
              Generation Failed
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {assignment?.errorMessage || "Something went wrong while generating your assignment."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg transition text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/create-assignment")}
                className="border border-amber-200 bg-white text-gray-700 px-5 py-2 rounded-lg hover:bg-amber-50 transition text-sm"
              >
                Create New
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (assignment?.status === "completed" && assignment.paper) {
    const paper = assignment.paper;
    
    const fixedSections = paper.sections?.map(section => ({
      ...section,
      instruction: section.instruction || ""
    })) || [];
    
    return (
      <div className="relative min-h-screen bg-[#fdfaf5]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        <Header />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 pb-20 sm:pb-6">
          {/* Action Buttons - Amber theme for UI */}
          <div className="hidden sm:flex flex-wrap items-center justify-between gap-2 mb-4 no-print">
            {user && (
              <div className="flex items-center gap-1.5 bg-white border border-amber-200 rounded-lg px-3 py-1.5 shadow-sm">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-medium text-gray-700">
                  Credits: <span className="font-bold text-amber-600">{user.credits}</span>
                </span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center justify-center gap-1.5 bg-white border border-amber-200 text-gray-700 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition text-xs font-medium"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
                
                {showSettings && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-amber-200 rounded-lg shadow-lg z-50">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-gray-900">Display Settings</h3>
                          <button
                            onClick={() => setShowSettings(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {showDifficulty ? (
                              <Eye className="w-4 h-4 text-amber-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-700">Show Difficulty Tags</span>
                          </div>
                          <button
                            onClick={() => setShowDifficulty(!showDifficulty)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                              showDifficulty ? "bg-amber-600" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                showDifficulty ? "translate-x-5" : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          {showDifficulty 
                            ? "Difficulty tags [Easy/Medium/Hard] are visible" 
                            : "Difficulty tags are hidden"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {user && (
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating || user.credits <= 0}
                  className="flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition text-xs font-medium disabled:opacity-50"
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Regen...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition text-xs font-medium"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              
              <button
                onClick={() => router.push("/create-assignment")}
                className="flex items-center justify-center gap-1.5 bg-white border border-amber-200 text-gray-700 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition text-xs font-medium"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                New
              </button>
            </div>
          </div>

          {/* Mobile Bottom Action Bar - Amber theme */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 py-2 px-4 sm:hidden no-print shadow-lg z-10">
            <div className="flex justify-around items-center">
              {user && (
                <div className="flex items-center gap-1 bg-amber-50 rounded-full px-2 py-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-medium text-gray-700">
                    {user.credits}
                  </span>
                </div>
              )}
              
              <button
                onClick={handlePrint}
                className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-amber-600 transition-colors"
                aria-label="Print"
              >
                <Printer className="w-5 h-5" />
                <span className="text-[10px]">Print</span>
              </button>
              
              <button
                onClick={() => router.push("/create-assignment")}
                className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-amber-600 transition-colors"
                aria-label="New Assignment"
              >
                <PlusCircle className="w-5 h-5" />
                <span className="text-[10px]">New</span>
              </button>
            </div>
          </div>

          {/* Question Paper - Pure Black & White */}
          <div
            ref={pdfRef}
            className="bg-white text-black print-container shadow-lg rounded-lg border border-gray-200"
            style={{ 
              fontFamily: "'Times New Roman', Times, serif", 
              fontSize: '11pt', 
              lineHeight: '1.25',
              padding: '0.6in',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            {/* TOP SECTION - School Header */}
            <div className="mb-8">
              {assignment.schoolName && (
                <h1 className="text-center text-3xl font-bold uppercase tracking-wide mb-12 text-black">
                  {assignment.schoolName}
                </h1>
              )}
              
              <div className="flex justify-between text-xs font-semibold">
                <p>Subject: {assignment.subject}</p>
                <p>Class: {assignment.class}</p>
              </div>
              
              <div className="flex justify-between text-xs mt-1">
                <p>Time Allowed: {assignment.timeAllowed}</p>
                <p>Maximum Marks: {assignment.totalMarks}</p>
              </div>
              
              <div className="my-3"></div>
              
              <div className="flex flex-wrap gap-6 text-xs">
                <span>Name: <span className="border-b border-black inline-block w-40 ml-1"></span></span>
                <span>Roll Number: <span className="border-b border-black inline-block w-32 ml-1"></span></span>
                <span>Section: <span className="border-b border-black inline-block w-24 ml-1"></span></span>
              </div>
            </div>

            {/* GENERAL INSTRUCTIONS */}
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wide mb-1">
                GENERAL INSTRUCTIONS:
              </h3>
              <div className="text-xs leading-relaxed space-y-0 ml-3">
                <p>1. Write your answers in the space provided.</p>
                <p>2. Read each question carefully before answering.</p>
                <p>3. Marks are indicated against each question.</p>
                <p className="mt-1">{paper.instructions}</p>
              </div>
            </div>

            {/* QUESTION SECTIONS */}
            {fixedSections.map((section, sectionIdx) => {
              const sectionDescription = getSectionDescription(section.title);
              const totalQuestions = section.questions?.length || 0;
              const attemptValue = sectionAttempts[section.title] || totalQuestions;
              
              return (
                <div key={sectionIdx} className="mb-4 section-container" data-section-title={section.title}>
                  <div className="mb-2">
                    <h2 className="text-center text-lg font-bold uppercase tracking-wide section-title">
                      {section.title}
                    </h2>
                    {sectionDescription && (
                      <p className="text-center text-xs italic mt-0.5 text-gray-600 section-description">
                        {sectionDescription}
                      </p>
                    )}
                    
                    {/* Dynamic Attempt Input - Shows "Attempt X out of Y" */}
                    <div className="flex justify-center mt-2 no-print">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                        <span className="text-xs text-gray-600">Attempt:</span>
                        <input
                          type="number"
                          value={tempAttempts[section.title] || ''}
                          onChange={(e) => handleTempAttemptChange(section.title, e.target.value)}
                          placeholder={String(totalQuestions)}
                          className="w-16 px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-center"
                          min="0"
                          max={totalQuestions}
                        />
                        <span className="text-xs text-gray-600">out of {totalQuestions}</span>
                        <button
                          onClick={() => applyAttempt(section.title, totalQuestions)}
                          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    
                    {/* Display current attempt info - This will be shown on print */}
                    <div className="text-center text-xs text-gray-500 mt-1 attempt-info-display" data-attempt-text={`Attempt ${attemptValue} out of ${totalQuestions} questions`}>
                      Attempt {attemptValue} out of {totalQuestions} questions
                    </div>
                  </div>
                  
                  {section.instruction && (
                    <p className="text-center text-[10px] italic text-gray-500 mb-3 hidden">
                       {section.instruction} 
                    </p>
                  )}
                  
                  {/* All questions are always displayed */}
                  <div className="questions-container">
                    {section.questions?.map((q, qIdx) => {
                      const questionKey = `${sectionIdx}-${qIdx}`;
                      return (
                        <div key={qIdx} className="mb-2 question-item">
                          {renderQuestionContent(q, questionKey)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="text-center text-[10px] text-gray-400 mt-4 pt-2 footer-text">
              Best of Luck!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
