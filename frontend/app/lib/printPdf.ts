

"use client";

export const printPDF = (element: HTMLElement | null, title: string = "Assignment") => {
  if (!element) return;

  const originalTitle = document.title;
  document.title = title;

  // Clone the element to avoid modifying the original
  const content = element.cloneNode(true) as HTMLElement;
  
  // Add comprehensive print-specific styles with professional spacing
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
          line-height: 1.4 !important;
          background: white;
        }
        
        /* Page margins - increased for better readability */
        @page {
          size: A4;
          margin: 0.8in 0.75in;
        }
        
        /* Hide all interactive elements */
        .no-print, button, .no-print * {
          display: none !important;
        }
        
        /* Remove background colors and shadows */
        .bg-white, .bg-gray-50, .shadow-lg {
          background: white !important;
          box-shadow: none !important;
        }
        
        /* School Header - Increased spacing and centered */
        h1 {
          font-size: 20pt !important;
          font-weight: bold !important;
          text-align: center !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          margin-top: 0 !important;
          margin-bottom: 64px !important;
          padding-bottom: 0 !important;
          width: 100% !important;
        }
        
        /* Subject and class section */
        .subject-class {
          display: flex !important;
          justify-content: space-between !important;
          margin-bottom: 12px !important;
        }
        
        .subject-class p {
          font-size: 11pt !important;
          font-weight: 600 !important;
          margin: 0 !important;
        }
        
        /* Time and marks section */
        .time-marks {
          display: flex !important;
          justify-content: space-between !important;
          margin-bottom: 20px !important;
        }
        
        .time-marks p {
          font-size: 11pt !important;
          margin: 0 !important;
        }
        
        /* Compulsory statement */
        .compulsory-text {
          font-size: 10pt !important;
          font-style: italic !important;
          margin: 16px 0 20px 0 !important;
        }
        
        /* Student info section */
        .student-info-section {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 32px !important;
          margin: 24px 0 32px 0 !important;
        }
        
        .student-info-section span {
          font-size: 10pt !important;
        }
        
        .student-info-section .underline {
          border-bottom: 1px solid black !important;
          display: inline-block !important;
          min-width: 120px !important;
          margin-left: 8px !important;
        }
        
        /* General instructions section */
        .general-instructions {
          margin: 24px 0 28px 0 !important;
        }
        
        .general-instructions h3 {
          font-size: 11pt !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          margin-bottom: 8px !important;
        }
        
        .general-instructions ul {
          margin-left: 20px !important;
        }
        
        .general-instructions li {
          font-size: 10pt !important;
          margin: 4px 0 !important;
          line-height: 1.3 !important;
        }
        
        .general-instructions p {
          font-size: 10pt !important;
          margin-top: 8px !important;
          margin-left: 0 !important;
        }
        
        /* Section containers */
        .section-container {
          margin-bottom: 32px !important;
          page-break-inside: avoid !important;
        }
        
        /* Section titles */
        .section-title {
          font-size: 14pt !important;
          font-weight: bold !important;
          text-align: center !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          margin: 24px 0 8px 0 !important;
        }
        
        /* Section description */
        .section-description {
          font-size: 10pt !important;
          font-style: italic !important;
          text-align: center !important;
          margin: 4px 0 12px 0 !important;
          color: #4a5568 !important;
        }
        
        /* Attempt info - Show custom text */
        .attempt-info {
          display: block !important;
          text-align: center !important;
          font-size: 9pt !important;
          font-style: italic !important;
          color: #555 !important;
          margin: 8px 0 12px 0 !important;
          font-weight: normal !important;
        }
        
        /* Hide old attempt text */
        .attempt-info.hidden, .text-gray-400, .text-center.text-\\[10px\\].text-gray-400 {
          display: none !important;
        }
        
        /* Section instruction */
        .section-instruction {
          font-size: 9pt !important;
          font-style: italic !important;
          text-align: center !important;
          color: #666 !important;
          margin: 8px 0 16px 0 !important;
        }
        
        /* Questions container */
        .questions-container {
          margin-top: 8px !important;
        }
        
        /* Individual question */
        .question-item {
          margin-bottom: 16px !important;
          page-break-inside: avoid !important;
        }
        
        /* Question text */
        .question-text {
          font-size: 11pt !important;
          line-height: 1.4 !important;
        }
        
        .question-number {
          font-weight: bold !important;
          margin-right: 4px !important;
        }
        
        /* Question marks and difficulty */
        .question-marks {
          font-weight: 500 !important;
          margin-left: 6px !important;
        }
        
        /* MCQ Options */
        .mcq-options {
          margin: 8px 0 4px 28px !important;
        }
        
        .mcq-option {
          font-size: 10pt !important;
          margin: 4px 0 !important;
          display: flex !important;
          align-items: flex-start !important;
          gap: 8px !important;
        }
        
        .mcq-option-letter {
          font-weight: 500 !important;
          min-width: 24px !important;
        }
        
        /* Fill in blanks */
        .fill-blanks {
          margin: 8px 0 4px 28px !important;
        }
        
        .fill-blank-item {
          margin: 6px 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        
        .fill-blank-line {
          border-bottom: 1px solid black !important;
          display: inline-block !important;
          min-width: 150px !important;
        }
        
        /* Hint */
        .hint-text {
          font-size: 9pt !important;
          font-style: italic !important;
          color: #666 !important;
          margin: 4px 0 0 28px !important;
        }
        
        /* Answer space */
        .answer-space {
          margin: 8px 0 0 28px !important;
          height: 20px !important;
        }
        
        /* Footer */
        .footer-text {
          font-size: 9pt !important;
          text-align: center !important;
          color: #666 !important;
          margin-top: 32px !important;
          padding-top: 16px !important;
          border-top: 1px solid #ddd !important;
        }
        
        /* Utility classes */
        .text-center { text-align: center !important; }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold !important; }
        .font-semibold { font-weight: 600 !important; }
        .italic { font-style: italic !important; }
        .uppercase { text-transform: uppercase !important; }
        .tracking-wide { letter-spacing: 0.5px !important; }
        
        /* Border utilities */
        .border-b {
          border-bottom: 1px solid black !important;
        }
        
        /* Spacing utilities */
        .mb-0 { margin-bottom: 0 !important; }
        .mb-1 { margin-bottom: 4px !important; }
        .mb-2 { margin-bottom: 8px !important; }
        .mb-3 { margin-bottom: 12px !important; }
        .mb-4 { margin-bottom: 16px !important; }
        .mb-6 { margin-bottom: 24px !important; }
        .mb-8 { margin-bottom: 32px !important; }
        .mt-0 { margin-top: 0 !important; }
        .mt-1 { margin-top: 4px !important; }
        .mt-2 { margin-top: 8px !important; }
        .mt-3 { margin-top: 12px !important; }
        .mt-4 { margin-top: 16px !important; }
        .my-2 { margin-top: 8px !important; margin-bottom: 8px !important; }
        .my-3 { margin-top: 12px !important; margin-bottom: 12px !important; }
        .ml-2 { margin-left: 8px !important; }
        .ml-3 { margin-left: 12px !important; }
        .ml-4 { margin-left: 16px !important; }
        .ml-5 { margin-left: 20px !important; }
        .ml-6 { margin-left: 24px !important; }
        
        /* Inline block */
        .inline-block {
          display: inline-block !important;
        }
        
        /* Width utilities */
        .w-16 { width: 64px !important; }
        .w-20 { width: 80px !important; }
        .w-24 { width: 96px !important; }
        .w-32 { width: 128px !important; }
        .w-40 { width: 160px !important; }
        
        /* Flex utilities */
        .flex {
          display: flex !important;
        }
        
        .justify-between {
          justify-content: space-between !important;
        }
        
        .flex-wrap {
          flex-wrap: wrap !important;
        }
        
        .gap-4 {
          gap: 16px !important;
        }
        
        .gap-6 {
          gap: 24px !important;
        }
        
        /* Page break utilities */
        .page-break-before {
          page-break-before: always !important;
        }
        
        .page-break-after {
          page-break-after: always !important;
        }
        
        .page-break-inside-avoid {
          page-break-inside: avoid !important;
        }
      }
    </style>
  `;

  // Clean up the content for printing
  const printContent = content;
  
  // Remove any interactive elements that shouldn't print
  const interactiveElements = printContent.querySelectorAll('button, .no-print');
  interactiveElements.forEach(el => el.remove());
  
  // Find all sections and add custom attempt text
  const sections = printContent.querySelectorAll('.section-container, div.mb-4');
  sections.forEach((section) => {
    // Look for attempt info in the section
    const attemptInfo = section.querySelector('.text-gray-400, .text-center.text-\\[10px\\].text-gray-400');
    if (attemptInfo) {
      const attemptText = attemptInfo.textContent || '';
      // Extract numbers from text like "Attempt X of Y questions" or "Showing X of Y questions"
      const match = attemptText.match(/(\d+)\s+of\s+(\d+)/);
      if (match) {
        const current = match[1];
        const total = match[2];
        
        // Create new attempt info element
        const newAttemptInfo = document.createElement('div');
        newAttemptInfo.className = 'attempt-info';
        newAttemptInfo.textContent = `Attempt ${current} out of ${total} questions`;
        
        // Insert after section title
        const sectionTitle = section.querySelector('h2');
        if (sectionTitle && sectionTitle.parentNode) {
          sectionTitle.parentNode.insertBefore(newAttemptInfo, sectionTitle.nextSibling);
        }
        
        // Remove old attempt text
        attemptInfo.remove();
      }
    }
  });

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
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for fonts and images to load
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        document.title = originalTitle;
      };
    };
  }
};
