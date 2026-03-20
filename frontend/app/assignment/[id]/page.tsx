"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "@/components/layout/Header";
import { socket } from "../../lib/socket";
import { downloadPDF } from "../../lib/downloadPdf";

export default function AssignmentPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);

  const pdfRef = useRef<HTMLDivElement>(null);

  const fetchAssignment = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/assignment/${id}`
      );

      const data = res.data.data;

      setAssignment(data);

      if (data.status !== "processing") {
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();

    socket.emit("join-assignment", id);

    socket.on("assignment-update", (data: any) => {
      if (data.assignmentId === id) {
        setAssignment((prev: any) => ({
          ...prev,
          ...data,
        }));

        if (data.status !== "processing") {
          setLoading(false);
        }
      }
    });

    return () => {
      socket.off("assignment-update");
    };
  }, [id]);

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto p-6">

        {/* LOADING */}
        {loading && (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold">
              Generating your paper...
            </h2>
            <p className="text-gray-400 mt-2">
              Real-time updates ⚡
            </p>
          </div>
        )}

        {/* FAILED */}
        {!loading && assignment?.status === "failed" && (
          <div className="text-center mt-20 text-red-500">
            Failed to generate assignment
          </div>
        )}

        {/* COMPLETED */}
        {!loading && assignment?.status === "completed" && (
          <>
            {/* 🔥 ACTION BAR */}
            <div className="flex justify-end mb-4 gap-2">
              <button
                onClick={() => downloadPDF(pdfRef.current)}
                className="bg-green-500 px-4 py-2 rounded text-sm hover:opacity-90"
              >
                Download PDF
              </button>
            </div>

            {/* 🔥 PDF AREA (WHITE FOR PRINT) */}
            <div
              ref={pdfRef}
              className="bg-white text-black p-6 rounded-lg"
            >
              <h1 className="text-2xl font-bold mb-6 text-center">
                Question Paper
              </h1>

              {/* Student Info */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div>Name: __________</div>
                <div>Roll No: ________</div>
                <div>Section: ________</div>
              </div>

              {/* Meta */}
              <div className="mb-6 text-sm">
                <p>Class: {assignment.class}</p>
                <p>Subject: {assignment.subject}</p>
                <p>Topic: {assignment.topic}</p>
                <p>Total Marks: {assignment.totalMarks}</p>
                <p>Time: {assignment.timeAllowed}</p>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h2 className="font-semibold">Instructions:</h2>
                <p>{assignment.paper?.instructions}</p>
              </div>

              {/* Sections */}
              {assignment.paper?.sections?.map((section: any, index: number) => (
                <div key={index} className="mb-8">

                  <h2 className="text-lg font-semibold mb-2">
                    {section.title}
                  </h2>

                  <p className="text-sm mb-3">
                    {section.instruction}
                  </p>

                  {section.questions?.map((q: any, i: number) => (
                    <div key={i} className="mb-4 border-b pb-3">

                      <div className="flex justify-between gap-4">

                        <p className="flex-1">
                          {q.number}. {q.text}
                        </p>

                        <div className="text-xs text-right">
                          <p>{q.difficulty}</p>
                          <p>{q.marks} marks</p>
                        </div>
                      </div>

                      {q.hint && (
                        <p className="text-xs mt-2">
                          Hint: {q.hint}
                        </p>
                      )}

                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}