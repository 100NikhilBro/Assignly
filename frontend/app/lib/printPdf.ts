"use client";

export const printPDF = (element: HTMLElement | null, title: string = "Assignment") => {
  if (!element) return;

  const originalTitle = document.title;
  document.title = title;

  // Clone the element to avoid modifying the original
  const content = element.cloneNode(true) as HTMLElement;
  
  // Add comprehensive print-specific styles
  const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      @media print {
        body {
          margin: 0;
          padding: 0;
          font-family: 'Times New Roman', Times, serif !important;
          font-size: 12pt !important;
          line-height: 1.3 !important;
          background: white;
        }
        
        /* Page margins */
        @page {
          size: A4;
          margin: 0.75in;
        }
        
        /* Hide print button */
        .no-print, button {
          display: none !important;
        }
        
        /* School header */
        h1 {
          font-size: 18pt !important;
          font-weight: bold !important;
          text-align: center !important;
          text-transform: uppercase !important;
          margin-bottom: 4px !important;
        }
        
        /* Subject and class */
        p {
          margin: 2px 0 !important;
        }
        
        /* Time and marks */
        .time-text, .marks-text {
          font-size: 11pt !important;
        }
        
        /* Instructions */
        .instructions-text {
          font-size: 11pt !important;
          font-style: italic !important;
          margin: 8px 0 !important;
        }
        
        /* Student info */
        .student-info {
          font-size: 11pt !important;
          margin: 12px 0 8px 0 !important;
        }
        
        .student-info span {
          display: inline-block;
          margin-right: 24px;
        }
        
        /* General instructions */
        .general-instructions {
          margin: 12px 0 !important;
        }
        
        .general-instructions h3 {
          font-size: 11pt !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          margin-bottom: 4px !important;
        }
        
        .general-instructions p {
          font-size: 10pt !important;
          margin: 0 0 2px 16px !important;
        }
        
        /* Section titles */
        .section-title {
          font-size: 14pt !important;
          font-weight: bold !important;
          text-align: center !important;
          text-transform: uppercase !important;
          margin: 12px 0 2px 0 !important;
        }
        
        .section-subtitle {
          font-size: 11pt !important;
          font-weight: 600 !important;
          text-align: center !important;
          margin: 2px 0 !important;
        }
        
        .section-instruction {
          font-size: 9pt !important;
          font-style: italic !important;
          text-align: center !important;
          color: #555 !important;
          margin-bottom: 8px !important;
        }
        
        /* Questions */
        .question-item {
          margin-bottom: 8px !important;
        }
        
        .question-text {
          font-size: 11pt !important;
          line-height: 1.3 !important;
        }
        
        .question-number {
          font-weight: bold !important;
        }
        
        /* Hint */
        .hint-text {
          font-size: 9pt !important;
          font-style: italic !important;
          color: #666 !important;
          margin-left: 24px !important;
          margin-top: 2px !important;
        }
        
        /* Answer space */
        .answer-space {
          height: 12px !important;
          margin-left: 24px !important;
        }
        
        /* Footer */
        .footer-text {
          font-size: 9pt !important;
          text-align: center !important;
          color: #888 !important;
          margin-top: 16px !important;
          padding-top: 8px !important;
          border-top: 1px solid #ccc !important;
        }
        
        /* Border utilities */
        .border-b {
          border-bottom: 1px solid #aaa !important;
        }
        
        .border-gray-400 {
          border-color: #9ca3af !important;
        }
        
        /* Spacing utilities */
        .mb-0 { margin-bottom: 0 !important; }
        .mb-1 { margin-bottom: 4px !important; }
        .mb-2 { margin-bottom: 8px !important; }
        .mb-3 { margin-bottom: 12px !important; }
        .mb-4 { margin-bottom: 16px !important; }
        .mt-0 { margin-top: 0 !important; }
        .mt-1 { margin-top: 4px !important; }
        .mt-2 { margin-top: 8px !important; }
        .my-2 { margin-top: 8px !important; margin-bottom: 8px !important; }
        .my-3 { margin-top: 12px !important; margin-bottom: 12px !important; }
        .ml-2 { margin-left: 8px !important; }
        .ml-4 { margin-left: 16px !important; }
        .ml-6 { margin-left: 24px !important; }
        .inline-block { display: inline-block !important; }
        .text-center { text-align: center !important; }
        .text-sm { font-size: 10pt !important; }
        .text-xs { font-size: 9pt !important; }
        .font-bold { font-weight: bold !important; }
        .font-semibold { font-weight: 600 !important; }
        .italic { font-style: italic !important; }
        .uppercase { text-transform: uppercase !important; }
        .tracking-wide { letter-spacing: 0.5px !important; }
        .w-20 { width: 80px !important; }
        .w-32 { width: 128px !important; }
        .w-40 { width: 160px !important; }
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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