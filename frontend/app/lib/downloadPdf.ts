// // // // // // // import jsPDF from "jspdf";
// // // // // // // import html2canvas from "html2canvas";

// // // // // // // export const downloadPDF = async (element: HTMLElement | null) => {
// // // // // // //   if (!element) return;

// // // // // // //   const canvas = await html2canvas(element, {
// // // // // // //     scale: 2,
// // // // // // //     useCORS: true,
// // // // // // //   });

// // // // // // //   const imgData = canvas.toDataURL("image/png");

// // // // // // //   const pdf = new jsPDF("p", "mm", "a4");

// // // // // // //   const imgWidth = 210;
// // // // // // //   const pageHeight = 295;

// // // // // // //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

// // // // // // //   let heightLeft = imgHeight;
// // // // // // //   let position = 0;

// // // // // // //   pdf.setFont("Times", "Normal");

// // // // // // //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
// // // // // // //   heightLeft -= pageHeight;

// // // // // // //   while (heightLeft > 0) {
// // // // // // //     position = heightLeft - imgHeight;
// // // // // // //     pdf.addPage();
// // // // // // //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
// // // // // // //     heightLeft -= pageHeight;
// // // // // // //   }

// // // // // // //   pdf.save("assignment.pdf");
// // // // // // // };


// // // // // // import jsPDF from "jspdf";
// // // // // // import html2canvas from "html2canvas";

// // // // // // export const downloadPDF = async (
// // // // // //   element: HTMLElement | null,
// // // // // //   filename: string = "assignment.pdf"
// // // // // // ) => {
// // // // // //   if (!element) {
// // // // // //     console.error("No element provided for PDF generation");
// // // // // //     return;
// // // // // //   }

// // // // // //   try {
// // // // // //     // Show loading indicator
// // // // // //     const loadingToast = document.createElement("div");
// // // // // //     loadingToast.className = "fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50";
// // // // // //     loadingToast.innerText = "Generating PDF...";
// // // // // //     document.body.appendChild(loadingToast);

// // // // // //     const canvas = await html2canvas(element, {
// // // // // //       scale: 2,
// // // // // //       useCORS: true,
// // // // // //       backgroundColor: "#ffffff",
// // // // // //       logging: false,
// // // // // //     });

// // // // // //     const imgData = canvas.toDataURL("image/png");
// // // // // //     const pdf = new jsPDF("p", "mm", "a4");
    
// // // // // //     const imgWidth = 190; // A4 width with margins
// // // // // //     const pageHeight = 277;
// // // // // //     const margin = 10;
    
// // // // // //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
// // // // // //     let heightLeft = imgHeight;
// // // // // //     let position = 0;

// // // // // //     pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// // // // // //     heightLeft -= pageHeight;

// // // // // //     while (heightLeft > 0) {
// // // // // //       position = heightLeft - imgHeight;
// // // // // //       pdf.addPage();
// // // // // //       pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// // // // // //       heightLeft -= pageHeight;
// // // // // //     }

// // // // // //     pdf.save(filename);
    
// // // // // //     // Remove loading toast
// // // // // //     loadingToast.remove();
    
// // // // // //     // Optional success toast
// // // // // //     console.log("PDF downloaded successfully");
    
// // // // // //   } catch (error) {
// // // // // //     console.error("PDF generation error:", error);
// // // // // //     alert("Failed to generate PDF. Please try again.");
// // // // // //   }
// // // // // // };



// // // // // "use client";

// // // // // // Dynamic import to avoid SSR issues with Node.js modules
// // // // // export const downloadPDF = async (
// // // // //   element: HTMLElement | null,
// // // // //   filename: string = "assignment.pdf"
// // // // // ) => {
// // // // //   if (!element) {
// // // // //     console.error("No element provided for PDF generation");
// // // // //     return;
// // // // //   }

// // // // //   try {
// // // // //     // Show loading indicator
// // // // //     const loadingToast = document.createElement("div");
// // // // //     loadingToast.className = "fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50";
// // // // //     loadingToast.innerText = "Generating PDF...";
// // // // //     document.body.appendChild(loadingToast);

// // // // //     // ✅ Dynamically import both libraries
// // // // //     const html2canvas = (await import("html2canvas")).default;
// // // // //     const { default: jsPDF } = await import("jspdf");

// // // // //     const canvas = await html2canvas(element, {
// // // // //       scale: 2,
// // // // //       useCORS: true,
// // // // //       backgroundColor: "#ffffff",
// // // // //       logging: false,
// // // // //     });

// // // // //     const imgData = canvas.toDataURL("image/png");
// // // // //     const pdf = new jsPDF("p", "mm", "a4");
    
// // // // //     const imgWidth = 190;
// // // // //     const pageHeight = 277;
// // // // //     const margin = 10;
    
// // // // //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
// // // // //     let heightLeft = imgHeight;
// // // // //     let position = 0;

// // // // //     pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// // // // //     heightLeft -= pageHeight;

// // // // //     while (heightLeft > 0) {
// // // // //       position = heightLeft - imgHeight;
// // // // //       pdf.addPage();
// // // // //       pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// // // // //       heightLeft -= pageHeight;
// // // // //     }

// // // // //     pdf.save(filename);
// // // // //     loadingToast.remove();
    
// // // // //     console.log("PDF downloaded successfully");
    
// // // // //   } catch (error) {
// // // // //     console.error("PDF generation error:", error);
// // // // //     alert("Failed to generate PDF. Please try again.");
// // // // //   }
// // // // // };



// // // // "use client";

// // // // import { useEffect, useState } from "react";

// // // // export const usePDF = () => {
// // // //   const [pdfLibs, setPdfLibs] = useState<{
// // // //     jsPDF: any;
// // // //     html2canvas: any;
// // // //   } | null>(null);

// // // //   useEffect(() => {
// // // //     const loadLibs = async () => {
// // // //       const [html2canvasModule, jsPDFModule] = await Promise.all([
// // // //         import("html2canvas"),
// // // //         import("jspdf"),
// // // //       ]);
// // // //       setPdfLibs({
// // // //         html2canvas: html2canvasModule.default,
// // // //         jsPDF: jsPDFModule.default,
// // // //       });
// // // //     };
// // // //     loadLibs();
// // // //   }, []);

// // // //   const downloadPDF = async (element: HTMLElement | null, filename: string = "assignment.pdf") => {
// // // //     if (!element || !pdfLibs) return;

// // // //     try {
// // // //       const loadingToast = document.createElement("div");
// // // //       loadingToast.className = "fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50";
// // // //       loadingToast.innerText = "Generating PDF...";
// // // //       document.body.appendChild(loadingToast);

// // // //       const canvas = await pdfLibs.html2canvas(element, {
// // // //         scale: 2,
// // // //         useCORS: true,
// // // //         backgroundColor: "#ffffff",
// // // //         logging: false,
// // // //       });

// // // //       const imgData = canvas.toDataURL("image/png");
// // // //       const pdf = new pdfLibs.jsPDF("p", "mm", "a4");
      
// // // //       const imgWidth = 190;
// // // //       const pageHeight = 277;
// // // //       const margin = 10;
      
// // // //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
// // // //       let heightLeft = imgHeight;
// // // //       let position = 0;

// // // //       pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// // // //       heightLeft -= pageHeight;

// // // //       while (heightLeft > 0) {
// // // //         position = heightLeft - imgHeight;
// // // //         pdf.addPage();
// // // //         pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// // // //         heightLeft -= pageHeight;
// // // //       }

// // // //       pdf.save(filename);
// // // //       loadingToast.remove();
      
// // // //     } catch (error) {
// // // //       console.error("PDF generation error:", error);
// // // //       alert("Failed to generate PDF. Please try again.");
// // // //     }
// // // //   };

// // // //   return { downloadPDF, isLoaded: !!pdfLibs };
// // // // };


// // // "use client";

// // // // Dynamic import to avoid SSR issues
// // // export const downloadPDF = async (
// // //   element: HTMLElement | null,
// // //   filename: string = "assignment.pdf"
// // // ) => {
// // //   if (!element) {
// // //     console.error("No element provided for PDF generation");
// // //     return;
// // //   }

// // //   try {
// // //     // Show loading indicator
// // //     const loadingToast = document.createElement("div");
// // //     loadingToast.className = "fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50";
// // //     loadingToast.innerText = "Generating PDF...";
// // //     document.body.appendChild(loadingToast);

// // //     // Dynamically import both libraries
// // //     const html2canvas = (await import("html2canvas")).default;
// // //     const { default: jsPDF } = await import("jspdf");

// // //     const canvas = await html2canvas(element, {
// // //       scale: 2,
// // //       useCORS: true,
// // //       backgroundColor: "#ffffff",
// // //       logging: false,
// // //     });

// // //     const imgData = canvas.toDataURL("image/png");
// // //     const pdf = new jsPDF("p", "mm", "a4");
    
// // //     const imgWidth = 190;
// // //     const pageHeight = 277;
// // //     const margin = 10;
    
// // //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
// // //     let heightLeft = imgHeight;
// // //     let position = 0;

// // //     pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// // //     heightLeft -= pageHeight;

// // //     while (heightLeft > 0) {
// // //       position = heightLeft - imgHeight;
// // //       pdf.addPage();
// // //       pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// // //       heightLeft -= pageHeight;
// // //     }

// // //     pdf.save(filename);
// // //     loadingToast.remove();
    
// // //     console.log("PDF downloaded successfully");
    
// // //   } catch (error) {
// // //     console.error("PDF generation error:", error);
// // //     alert("Failed to generate PDF. Please try again.");
// // //   }
// // // };


// // "use client";

// // import { useEffect, useState } from "react";

// // export const usePDF = () => {
// //   const [pdfLibs, setPdfLibs] = useState<{
// //     jsPDF: any;
// //     html2canvas: any;
// //   } | null>(null);

// //   useEffect(() => {
// //     const loadLibs = async () => {
// //       const [html2canvasModule, jsPDFModule] = await Promise.all([
// //         import("html2canvas"),
// //         import("jspdf"),
// //       ]);
// //       setPdfLibs({
// //         html2canvas: html2canvasModule.default,
// //         jsPDF: jsPDFModule.default,
// //       });
// //     };
// //     loadLibs();
// //   }, []);

// //   const downloadPDF = async (element: HTMLElement | null, filename: string = "assignment.pdf") => {
// //     if (!element || !pdfLibs) return;

// //     try {
// //       const loadingToast = document.createElement("div");
// //       loadingToast.className = "fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50";
// //       loadingToast.innerText = "Generating PDF...";
// //       document.body.appendChild(loadingToast);

// //       const canvas = await pdfLibs.html2canvas(element, {
// //         scale: 2,
// //         useCORS: true,
// //         backgroundColor: "#ffffff",
// //         logging: false,
// //       });

// //       const imgData = canvas.toDataURL("image/png");
// //       const pdf = new pdfLibs.jsPDF("p", "mm", "a4");
      
// //       const imgWidth = 190;
// //       const pageHeight = 277;
// //       const margin = 10;
      
// //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
// //       let heightLeft = imgHeight;
// //       let position = 0;

// //       pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// //       heightLeft -= pageHeight;

// //       while (heightLeft > 0) {
// //         position = heightLeft - imgHeight;
// //         pdf.addPage();
// //         pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// //         heightLeft -= pageHeight;
// //       }

// //       pdf.save(filename);
// //       loadingToast.remove();
      
// //     } catch (error) {
// //       console.error("PDF generation error:", error);
// //       alert("Failed to generate PDF. Please try again.");
// //     }
// //   };

// //   return { downloadPDF, isLoaded: !!pdfLibs };
// // };


// "use client";

// import { useState, useCallback } from 'react';

// export const usePDF = () => {
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);

//   const downloadPDF = useCallback(async (element: HTMLElement | null, filename: string) => {
//     if (!element) return;
    
//     setIsGenerating(true);
    
//     try {
//       // Show loading toast
//       const toast = document.createElement('div');
//       toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50';
//       toast.innerText = 'Generating PDF...';
//       document.body.appendChild(toast);
      
//       // Dynamic import - only runs in browser
//       const { generatePDF } = await import('./pdfGenerator');
//       await generatePDF(element, filename);
      
//       toast.remove();
//     } catch (error) {
//       console.error('PDF generation failed:', error);
//       alert('Failed to generate PDF. Please try again.');
//     } finally {
//       setIsGenerating(false);
//     }
//   }, []);

//   return { downloadPDF, isGenerating, isLoaded: true };
// };