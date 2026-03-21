// "use client";

// // This file is marked as client-only
// export const generatePDF = async (element: HTMLElement, filename: string) => {
//   // Dynamic import to avoid SSR
//   const html2canvas = (await import('html2canvas')).default;
//   const { default: jsPDF } = await import('jspdf');
  
//   const canvas = await html2canvas(element, {
//     scale: 2,
//     backgroundColor: '#ffffff',
//     logging: false,
//     useCORS: true,
//   });
  
//   const imgData = canvas.toDataURL('image/png');
//   const pdf = new jsPDF('p', 'mm', 'a4');
//   const imgWidth = 190;
//   const pageHeight = 277;
//   const margin = 10;
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
//   let heightLeft = imgHeight;
//   let position = 0;
  
//   pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
//   heightLeft -= pageHeight;
  
//   while (heightLeft > 0) {
//     position = heightLeft - imgHeight;
//     pdf.addPage();
//     pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;
//   }
  
//   pdf.save(filename);
// };