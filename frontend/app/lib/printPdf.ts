// "use client";

// export const printPDF = (element: HTMLElement | null, title: string = "Assignment") => {
//   if (!element) return;

//   // Get the HTML content
//   const originalTitle = document.title;
//   document.title = title;

//   // Clone the element to avoid modifying the original
//   const content = element.cloneNode(true) as HTMLElement;
  
//   // Add print-specific styles
//   const styles = `
//     <style>
//       @media print {
//         body {
//           margin: 0;
//           padding: 20px;
//           font-family: 'Times New Roman', Times, serif;
//         }
//         .no-print {
//           display: none;
//         }
//         button {
//           display: none;
//         }
//         .print-container {
//           max-width: 100%;
//         }
//         .bg-gray-50 {
//           background-color: #f9fafb;
//         }
//       }
//     </style>
//   `;

//   // Create print window
//   const printWindow = window.open('', '_blank');
//   if (printWindow) {
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>${title}</title>
//           <meta charset="utf-8" />
//           ${styles}
//         </head>
//         <body>
//           ${content.outerHTML}
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//     printWindow.onafterprint = () => {
//       printWindow.close();
//       document.title = originalTitle;
//     };
//   }
// };

"use client";

export const printPDF = (element: HTMLElement | null, title: string = "Assignment") => {
  if (!element) return;

  const originalTitle = document.title;
  document.title = title;

  // Clone the element to avoid modifying the original
  const content = element.cloneNode(true) as HTMLElement;
  
  // Add print-specific styles
  const styles = `
    <style>
      @media print {
        body {
          margin: 0;
          padding: 0;
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.4;
        }
        button {
          display: none;
        }
        .no-print {
          display: none;
        }
        @page {
          margin: 1.5cm;
        }
        .border-b {
          border-bottom: 1px solid #ccc;
        }
        .border-t-2 {
          border-top: 2px solid #000;
        }
        .border-gray-400 {
          border-color: #9ca3af;
        }
        .border-gray-300 {
          border-color: #d1d5db;
        }
      }
    </style>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8" />
          ${styles}
        </head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
      document.title = originalTitle;
    };
  }
};