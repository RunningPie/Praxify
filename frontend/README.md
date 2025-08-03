# Praxify - Frontend

This is the frontend for Praxify, a modern, responsive Single-Page Application (SPA) built with React. It provides a seamless and intuitive user interface for non-technical users to define, refine, and visualize their software projects.

---

## ✨ Key Features

- **Landing Page**: Professional landing page showcasing Praxify's value proposition and features
- **Interactive Editor**: A minimalist, distraction-free text editor for writing and structuring requirements
- **AI Assistant Panel**: A dynamic side panel that provides real-time feedback, questions, and validation results from the AI
- **Live Validation**: Real-time requirement quality checking with debounced validation calls
- **Diagram Visualization**: Renders architectural diagrams directly in the browser using the Mermaid.js library
- **Responsive Design**: Fully responsive layout built with Tailwind CSS, ensuring a great experience on any screen size (though desktop-first)

---

## 🛠️ Technology Stack

- **Framework**: React 18 (with Vite)
- **UI Components**: ShadCN/UI
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: Native `fetch` API
- **Backend Integration**: Direct API calls to FastAPI backend
- **Icons**: Lucide React
- **Charts/Diagrams**: Mermaid.js (for architectural diagrams)

---

## 📂 Project Structure

A simplified overview of the `/src` directory:

- **`/components`**: Reusable UI components
  - **`/ui`**: Auto-generated components from ShadCN/UI
  - **`/landing`**: Landing page specific components
  - **`/workspace`**: Workspace/editor specific components
- **`/pages`**: Main application pages
  - **`/LandingPage.jsx`**: The landing page component
  - **`/WorkspacePage.jsx`**: The main workspace with editor and AI panel
- **`/lib`**: Utility functions and API clients
- **`/hooks`**: Custom React hooks for managing state or side effects
- **`/styles`**: Global styles and Tailwind configuration
- **`App.jsx`**: The main application component and router

---

## 🚀 How to Run Locally

1.  **Navigate to the frontend directory**
    ```bash
    cd frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    - Create a file named `.env.local` in the `/frontend` directory.
    - Add your backend API URL:
      ```
      VITE_API_URL="http://localhost:8000"
      ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## 🎨 Design System

- **Primary Colors**: Purple gradients (#8B5CF6 to #7C3AED)
- **Secondary Colors**: Light blue accents (#3B82F6)
- **Background**: White (#FFFFFF) and light purple (#F3F4F6)
- **Typography**: Modern sans-serif with clear hierarchy
- **Components**: Rounded corners, subtle shadows, and smooth transitions
