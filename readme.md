# 🧠 Assignly

<p align="center">
  <strong>AI-powered Assessment Creator with Structured Generation, Validation & Real-Time Processing</strong>
</p>

<p align="center">
  Generate exam-ready question papers using AI — backed by validation pipelines, async processing, and real-time updates.
</p>

---

## 🚀 Overview

Assignly is a production-grade AI system that ensures generated content is:

* Structured
* Validated
* Reliable

Pipeline:

**Parse → Validate → Normalize → Store → Deliver**

---

## 📄 Sample Output (PDF)

* 📄 Sample Paper 1: https://drive.google.com/file/d/1oY42GvxsnvGZAqU4zBKAk52r3ARF-kHU/view?usp=sharing
* 📄 Sample Paper 2: https://drive.google.com/file/d/10sPlg7DXI03NttIcJ0eub04n0q7KMz2O/view?usp=sharing

---

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/100NikhilBro/Assignly/blob/main/Screenshot%202026-03-23%20232905.png" width="45%" />
  <img src="https://github.com/100NikhilBro/Assignly/blob/main/WhatsApp%20Image%202026-03-23%20at%2018.21.42.jpeg" width="45%" />
</p>

<p align="center">
  <img src="https://github.com/100NikhilBro/Assignly/blob/main/WhatsApp%20Image%202026-03-23%20at%2018.21.43.jpeg" width="60%" />
</p>

---

## 🛠️ Tech Stack

| Layer         | Technologies                      |
| ------------- | --------------------------------- |
| Frontend      | Next.js, TypeScript, Tailwind CSS |
| Backend       | Node.js, Express, TypeScript      |
| Database      | MongoDB Atlas                     |
| Queue & Cache | Redis + BullMQ                    |
| Real-Time     | WebSocket                         |
| AI            | Gemini / LLM APIs                 |
| Deployment    | Vercel, Render, Upstash           |

---

## ✨ Features

* AI-based question paper generation
* Structured input with difficulty control
* Validation pipeline for quality assurance
* Background job processing (BullMQ)
* Real-time updates via WebSockets
* Credit-based usage system

---

## 🏗️ Architecture

```mermaid
flowchart LR

U[User] --> FE[Frontend]
FE --> API[Backend]

API --> Q[Queue]
Q --> W[Worker]

W --> AI[LLM]
AI --> PARSE[Parser]
PARSE --> VALIDATE[Validator]
VALIDATE --> NORMALIZE[Normalizer]

NORMALIZE --> DB[(MongoDB)]
NORMALIZE --> CACHE[(Redis)]

W --> WS[WebSocket]
WS --> FE
```

---

## 🔄 Flow

1. User submits assignment
2. API queues job
3. Worker processes (AI → validate → normalize)
4. Data stored + cached
5. Real-time updates sent
6. Frontend fetches result

---

## 🧠 AI Pipeline

* Prompt Builder → structured input
* AI Generation → question paper
* Parser → JSON extraction
* Validator → removes invalid data
* Normalizer → fixes format & duplicates

> Raw AI output is never shown directly.

---

## 📊 Marks Engine

* Difficulty-based distribution
* Weighted marks allocation
* Ensures total consistency

---

## 🛟 Reliability

* Retry mechanism (3 attempts)
* Invalid output rejection
* Fallback generation
* Duplicate removal

---

## ⚡ Performance

* Redis caching
* Async processing
* Cache-first fetching

---

## 🚀 Deployment

* Frontend: Vercel
* Backend: Render
* Redis: Upstash
* Database: MongoDB Atlas

---

## 🔮 Future Improvements

* 🧠 Improve AI accuracy with better validation & self-checking
* 🧩 Advanced MCQs with explanations and difficulty control
* 📄 PDF export with clean, exam-ready formatting

---

## 🤝 Contributing

1. Fork repo
2. Create branch
3. Open PR

---

## 📄 License

MIT

---

<p align="center">
  Made by <strong>Nikhil Gupta</strong>
</p>
