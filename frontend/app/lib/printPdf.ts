"use client";

export const printPDF = (element: HTMLElement | null, title: string = "Assignment", sectionAttempts: Record<string, number> = {}) => {
  if (!element) return;

  const originalTitle = document.title;
  document.title = title;

  // Clone the element to avoid modifying the original
  const content = element.cloneNode(true) as HTMLElement;
  
  // Function to remove "Attempt all questions" and "Attempt any questions" text from any node
  const removeAttemptText = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent || '';
      let modified = false;
      
      // Remove various patterns of attempt text
      const patterns = [
        /Attempt\s+all\s+questions/gi,
        /Attempt\s+any\s+questions/gi,
        /Attempt\s+all/gi,
        /Attempt\s+any/gi,
        /All questions are compulsory/gi,
        /Attempt any \d+ out of \d+ questions/gi,
        /Attempt all \d+ questions/gi,
        /Choose any \d+ questions/gi,
        /Answer any \d+ questions/gi,
        /Do any \d+ questions/gi,
        /Select any \d+ questions/gi,
        /Write any \d+ questions/gi,
        /Solve any \d+ questions/gi
      ];
      
      patterns.forEach(pattern => {
        if (pattern.test(text)) {
          text = text.replace(pattern, '');
          modified = true;
        }
      });
      
      // Clean up extra spaces and punctuation
      if (modified) {
        text = text.replace(/\s+/g, ' ').trim();
        // Remove leading punctuation like . , : ; etc
        text = text.replace(/^[.,:;)\]\s]+/, '');
        // Remove trailing punctuation if text becomes empty
        if (text === '' || text === '.' || text === ',' || text === ';') {
          text = '';
        }
        node.textContent = text;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Recursively process child nodes
      const children = Array.from(node.childNodes);
      children.forEach(child => removeAttemptText(child));
      
      // Check if this element itself contains attempt text in its textContent
      if (node.textContent && node.textContent.trim() !== '') {
        const elementNode = node as HTMLElement;
        // If the element becomes empty after removing text, hide it
        if (elementNode.textContent && elementNode.textContent.trim() === '') {
          elementNode.style.display = 'none';
        }
      }
    }
  };
  
  // Apply text removal to the entire content
  removeAttemptText(content);
  
  // Also remove any elements that might contain attempt text in class names or data attributes
  const attemptElements = content.querySelectorAll('[class*="attempt"], [class*="Attempt"], [data-attempt]');
  attemptElements.forEach(el => {
    if (el.textContent && /attempt|Attempt/i.test(el.textContent)) {
      // Check if the element's text content contains attempt text
      const text = el.textContent;
      if (/attempt all|attempt any|all questions are compulsory/i.test(text)) {
        el.remove();
      }
    }
  });
  
  // Add comprehensive print-specific styles with professional spacing - NO PAGE BREAKS
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
        
        /* Page margins - clean and consistent */
        @page {
          size: A4;
          margin: 0.8in 0.75in;
        }
        
        /* Hide all interactive elements */
        .no-print, button, input, .no-print * {
          display: none !important;
        }
        
        /* Remove background colors and shadows */
        .bg-white, .bg-gray-50, .shadow-lg, .shadow-sm {
          background: white !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        /* Remove borders */
        .border, .border-gray-200, .border-amber-200 {
          border: none !important;
        }
        
        /* School Header */
        h1 {
          font-size: 20pt !important;
          font-weight: bold !important;
          text-align: center !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          margin-top: 0 !important;
          margin-bottom: 48px !important;
          padding-bottom: 0 !important;
        }
        
        /* Subject, Class, Time, Marks layout */
        .header-info {
          display: flex !important;
          justify-content: space-between !important;
          margin-bottom: 12px !important;
        }
        
        .header-info p {
          font-size: 11pt !important;
          font-weight: 600 !important;
          margin: 0 !important;
        }
        
        /* Student info section */
        .student-info {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 32px !important;
          margin: 24px 0 32px 0 !important;
        }
        
        .student-info span {
          font-size: 10pt !important;
        }
        
        .student-info .underline {
          border-bottom: 1px solid black !important;
          display: inline-block !important;
          min-width: 120px !important;
          margin-left: 8px !important;
        }
        
        /* General instructions */
        .general-instructions {
          margin: 20px 0 28px 0 !important;
        }
        
        .general-instructions h3 {
          font-size: 11pt !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          margin-bottom: 8px !important;
        }
        
        .general-instructions p, .general-instructions li {
          font-size: 10pt !important;
          line-height: 1.3 !important;
          margin: 4px 0 !important;
        }
        
        .general-instructions ul, .general-instructions ol {
          margin-left: 20px !important;
        }
        
        /* Section containers - NO PAGE BREAKS */
        .section-container {
          margin-bottom: 40px !important;
          /* No page-break-inside to allow natural flow */
        }
        
        /* Section titles */
        .section-title, h2 {
          font-size: 14pt !important;
          font-weight: bold !important;
          text-align: center !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          margin: 28px 0 8px 0 !important;
        }
        
        /* Section description */
        .section-description {
          font-size: 10pt !important;
          font-style: italic !important;
          text-align: center !important;
          margin: 4px 0 12px 0 !important;
          color: #4a5568 !important;
        }
        
        /* Attempt info - Custom text for each section */
        .attempt-info {
          display: block !important;
          text-align: center !important;
          font-size: 10pt !important;
          font-style: italic !important;
          color: #2c3e50 !important;
          margin: 12px 0 20px 0 !important;
          font-weight: 500 !important;
          padding: 8px 0 !important;
          border-top: 1px solid #e5e7eb !important;
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #fafaf9 !important;
        }
        
        /* Hide the original attempt display */
        .attempt-info-display {
          display: none !important;
        }
        
        /* Questions container */
        .questions-container {
          margin-top: 8px !important;
        }
        
        /* Individual question */
        .question-item {
          margin-bottom: 20px !important;
          /* No page-break-inside to allow natural flow */
        }
        
        /* Question text */
        .question-text {
          font-size: 11pt !important;
          line-height: 1.4 !important;
        }
        
        .question-number {
          font-weight: bold !important;
          margin-right: 6px !important;
        }
        
        /* Question marks */
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
          height: 24px !important;
        }
        
        /* Footer */
        .footer-text {
          font-size: 9pt !important;
          text-align: center !important;
          color: #666 !important;
          margin-top: 40px !important;
          padding-top: 16px !important;
          border-top: 1px solid #e5e7eb !important;
        }
        
        /* Utility classes */
        .text-center { text-align: center !important; }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold !important; }
        .font-semibold { font-weight: 600 !important; }
        .italic { font-style: italic !important; }
        .uppercase { text-transform: uppercase !important; }
        
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
        .ml-2 { margin-left: 8px !important; }
        .ml-3 { margin-left: 12px !important; }
        .ml-4 { margin-left: 16px !important; }
        .ml-5 { margin-left: 20px !important; }
        
        /* Flex utilities */
        .flex { display: flex !important; }
        .justify-between { justify-content: space-between !important; }
        .flex-wrap { flex-wrap: wrap !important; }
        .gap-4 { gap: 16px !important; }
        .gap-6 { gap: 24px !important; }
        
        /* Inline block */
        .inline-block { display: inline-block !important; }
        
        /* Width utilities */
        .w-16 { width: 64px !important; }
        .w-20 { width: 80px !important; }
        .w-24 { width: 96px !important; }
        .w-32 { width: 128px !important; }
        .w-40 { width: 160px !important; }
      }
    </style>
  `;

  // Clean up the content for printing
  const printContent = content;
  
  // Remove any remaining interactive elements
  const interactiveElements = printContent.querySelectorAll('button, input, .no-print');
  interactiveElements.forEach(el => el.remove());
  
  // Find all sections and replace attempt info with custom text
  const sections = printContent.querySelectorAll('.section-container, div.mb-4');
  sections.forEach((section) => {
    // Get section title
    const sectionTitleElem = section.querySelector('.section-title, h2');
    let sectionTitle = '';
    if (sectionTitleElem) {
      sectionTitle = sectionTitleElem.textContent?.trim() || '';
    }
    
    // Get the attempt value from the data attribute
    let attemptValue = 0;
    let totalQuestions = 0;
    
    // Try to get from data attribute
    const attemptDisplay = section.querySelector('.attempt-info-display');
    if (attemptDisplay) {
      const attemptText = attemptDisplay.textContent || '';
      const match = attemptText.match(/Attempt (\d+) out of (\d+)/);
      if (match) {
        attemptValue = parseInt(match[1]);
        totalQuestions = parseInt(match[2]);
      }
      // Remove the original attempt display
      attemptDisplay.remove();
    }
    
    // If not found, count questions
    if (totalQuestions === 0) {
      const questions = section.querySelectorAll('.question-item');
      totalQuestions = questions.length;
      attemptValue = sectionAttempts[sectionTitle] || totalQuestions;
    }
    
    // Create new attempt info element with custom text
    const newAttemptInfo = document.createElement('div');
    newAttemptInfo.className = 'attempt-info';
    newAttemptInfo.textContent = `Attempt ${attemptValue} out of ${totalQuestions} questions`;
    
    // Insert after section title
    const sectionHeader = section.querySelector('.mb-2');
    if (sectionHeader && sectionHeader.parentNode) {
      sectionHeader.parentNode.insertBefore(newAttemptInfo, sectionHeader.nextSibling);
    } else if (sectionTitleElem && sectionTitleElem.parentNode) {
      sectionTitleElem.parentNode.insertBefore(newAttemptInfo, sectionTitleElem.nextSibling);
    }
  });
  
  // Final cleanup - remove any empty paragraphs or divs
  const allElements = printContent.querySelectorAll('p, div');
  allElements.forEach(el => {
    if (el.textContent && el.textContent.trim() === '') {
      el.remove();
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
