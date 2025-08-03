# ✨ Praxify

### Turn Vague Ideas into Project-Ready Specs with AI

Praxify is an AI-powered co-pilot that helps non-technical stakeholders in government and SMEs define, validate, and visualize their software requirements, ensuring every project starts on a solid foundation.

---

## 🔗 Important Links

- **Live Demo**: [https://praxify.vercel.app](https://praxify.vercel.app) <!-- Placeholder -->
- **UI/UX Mockups**: [Figma Design File](https://figma.com/your-design-link) <!-- Placeholder -->
- **Demo Video**: [Watch on YouTube](https://youtube.com/your-video-link) <!-- Placeholder -->

---

## 🎯 The Problem

A significant number of digital projects fail due to poorly defined requirements. Non-technical stakeholders struggle to translate their vision into clear, unambiguous specifications, leading to misunderstandings, scope creep, and wasted resources.

## 💡 The Solution

Praxify guides users through a structured process to transform their initial idea into a developer-ready blueprint.

- **AI-Powered Elicitation**: Asks clarifying questions to uncover hidden needs.
- **Automated Validation**: Scans the document for ambiguous words to ensure clarity.
- **Instant Visualization**: Generates a C4 model diagram with a single click to bridge the communication gap.

---

## 🛠️ Technology Stack

Praxify is built on a modern, scalable, and serverless tech stack.

- **Frontend**: React (Vite), Tailwind CSS, ShadCN/UI
- **Backend**: Python Serverless Functions on Vercel
- **Database**: Supabase (Postgres)
- **AI/ML**: Google Gemini API, NLTK

![A simple diagram showing Frontend communicates with Serverless Functions, which in turn communicate with Supabase and Gemini API]
<!-- Placeholder for a simple text or image diagram -->

---

## 🚀 Getting Started

This project is a monorepo containing the `frontend` and `api` (backend) directories.

### Prerequisites

- Node.js and npm
- Python 3.9+
- Vercel CLI

### Running Locally

1.  **Clone the repository**
    ```bash
    git clone [your-repo-url]
    cd [your-repo-url]
    ```

2.  **Set up the Backend**
    - Follow the instructions in the `/api/README.md` file.

3.  **Set up the Frontend**
    - Follow the instructions in the `/frontend/README.md` file.

4.  **Run both concurrently**
    - Use the Vercel CLI from the root directory to run both the frontend and backend development servers simultaneously.
    ```bash
    vercel dev
    ```

---

## 🗺️ Future Roadmap

- **User Accounts & Projects**: Implement user authentication with Supabase Auth to manage multiple projects.
- **PWA Conversion**: Enable offline access to saved requirements and diagrams.
- **Export Options**: Allow users to export documents as PDF or DOCX files.
