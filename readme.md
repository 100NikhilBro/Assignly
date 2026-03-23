<!-- ========================== INTRODUCTION ========================== -->

<h1 align="center">🧠 Assignly</h1>

<p align="center">
  <strong>AI-powered Assessment Creator with structured generation, validation, and real-time processing</strong>
</p>

<p align="center">
  Assignly enables teachers to generate high-quality, exam-ready question papers using AI — with strict backend validation, structured formatting, and real-time feedback.  
  Unlike basic AI apps, it enforces a **robust processing pipeline (parse → validate → normalize)** ensuring reliable and production-grade outputs.
</p>

<hr/>

<!-- ========================== SCREENSHOTS ========================== -->

<h2>📸 Screenshots</h2>

<p align="center">
  <img src="YOUR_CREATE_PAGE_IMAGE" alt="Create Assignment" width="45%" />
  <img src="YOUR_DASHBOARD_IMAGE" alt="Dashboard" width="45%" />
</p>

<p align="center">
  <img src="YOUR_OUTPUT_IMAGE" alt="Generated Paper" width="60%" />
</p>

---

<!-- ========================== TECH STACK ========================== -->

<h2>🛠️ Tech Stack</h2>

<table>
  <thead>
    <tr>
      <th align="left">Layer</th>
      <th align="left">Technologies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend</strong></td>
      <td>Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons</td>
    </tr>
    <tr>
      <td><strong>State Management</strong></td>
      <td>Zustand</td>
    </tr>
    <tr>
      <td><strong>Backend</strong></td>
      <td>Node.js, Express, TypeScript</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>MongoDB (Assignment storage)</td>
    </tr>
    <tr>
      <td><strong>Cache & Queue</strong></td>
      <td>Redis + BullMQ</td>
    </tr>
    <tr>
      <td><strong>Real-Time</strong></td>
      <td>WebSocket</td>
    </tr>
    <tr>
      <td><strong>AI</strong></td>
      <td>Gemini / LLM + Custom Prompt Engineering</td>
    </tr>
    <tr>
      <td><strong>Deployment</strong></td>
      <td>Vercel (Frontend), Render (Backend), Upstash (Redis), MongoDB Atlas</td>
    </tr>
  </tbody>
</table>

---

<!-- ========================== CORE FEATURES ========================== -->

<h2>✨ Core Features</h2>

<table>
  <thead>
    <tr>
      <th align="left">Feature</th>
      <th align="left">Description</th>
      <th align="center">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Assignment Creation</strong></td>
      <td>Structured form with validation, concepts, difficulty control, and instructions</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>AI Question Generation</strong></td>
      <td>Generates structured sections, difficulty levels, and marks distribution</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>Validation Pipeline</strong></td>
      <td>Ensures AI output quality, removes invalid questions, enforces structure</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>Background Processing</strong></td>
      <td>BullMQ worker handles AI generation asynchronously</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>Real-Time Updates</strong></td>
      <td>WebSocket emits processing status (attempts, success, failure)</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>Credit System</strong></td>
      <td>Guest + user-based credit deduction system</td>
      <td align="center">✅</td>
    </tr>
  </tbody>
</table>

---

<!-- ========================== SYSTEM ARCHITECTURE ========================== -->

<h2>🏗️ System Architecture</h2>

<p align="center">
  <img src="YOUR_ARCHITECTURE_IMAGE" alt="System Architecture" width="85%" />
</p>

<ul>
  <li>
    <strong>Frontend:</strong> Next.js app handling UI, form state, and WebSocket subscriptions for live updates.
  </li>

  <li>
    <strong>Backend:</strong> Express server using modular architecture (middleware → controller → service).
  </li>

  <li>
    <strong>Queue System:</strong> BullMQ processes assignment generation asynchronously to avoid blocking API.
  </li>

  <li>
    <strong>Worker:</strong> Handles AI calls, parsing, validation, normalization, and fallback logic.
  </li>

  <li>
    <strong>Cache Layer:</strong> Redis stores assignment results and reduces repeated DB hits.
  </li>

  <li>
    <strong>Database:</strong> MongoDB stores assignments, generated papers, and processing state.
  </li>

  <li>
    <strong>Real-Time Layer:</strong> WebSocket emits status updates (processing, retry, completed).
  </li>
</ul>

---

<!-- ========================== AI PIPELINE ========================== -->

<h2>🧠 AI Processing Pipeline</h2>

<ul>
  <li><strong>Prompt Builder:</strong> Converts user input into structured exam prompt</li>
  <li><strong>AI Generation:</strong> LLM generates question paper</li>
  <li><strong>Parser:</strong> Extracts JSON safely (with repair fallback)</li>
  <li><strong>Validator:</strong> Ensures question quality and structure</li>
  <li><strong>Normalizer:</strong> Fixes duplicates, enforces marks & format</li>
</ul>

<p><strong>⚠️ Important:</strong> Raw AI output is NEVER rendered directly.</p>

---

<!-- ========================== MARKS ENGINE ========================== -->

<h2>📊 Marks Distribution Engine</h2>

<ul>
  <li>Dynamic ratio-based distribution (easy / medium / hard)</li>
  <li>Weighted algorithm to match total marks</li>
  <li>Tolerance-based acceptance system</li>
</ul>

---

<!-- ========================== RELIABILITY ========================== -->

<h2>🛟 Reliability Features</h2>

<ul>
  <li>Retry mechanism (up to 3 attempts)</li>
  <li>Validation-based rejection</li>
  <li>Fallback paper generation if AI fails</li>
  <li>Duplicate question handling</li>
</ul>

---

<!-- ========================== DEPLOYMENT ========================== -->

<h2>🚀 Deployment</h2>

<ul>
  <li><strong>Frontend:</strong> Vercel</li>
  <li><strong>Backend:</strong> Render</li>
  <li><strong>Redis:</strong> Upstash</li>
  <li><strong>Database:</strong> MongoDB Atlas</li>
</ul>

---

<!-- ========================== WHY IT'S ADVANCED ========================== -->

<h2>💡 Why Assignly is Advanced</h2>

<ul>
  <li>Does NOT rely blindly on AI output</li>
  <li>Implements full validation + normalization pipeline</li>
  <li>Uses queue-based architecture (BullMQ)</li>
  <li>Real-time feedback system via WebSockets</li>
  <li>Production-ready backend with retry & fallback logic</li>
</ul>

---

<p align="center">Made with ❤️ by <strong>Nikhil Gupta</strong></p>
