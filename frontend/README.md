# Praxify - Frontend

This is the frontend for Praxify, a modern, responsive Single-Page Application (SPA) built with React. It provides a seamless and intuitive user interface for non-technical users to define, refine, and visualize their software projects.

---

## ✨ Key Features

- **Interactive Editor**: A minimalist, distraction-free text editor for writing and structuring requirements.
- **AI Assistant Panel**: A dynamic side panel that provides real-time feedback, questions, and validation results from the AI.
- **Diagram Visualization**: Renders architectural diagrams directly in the browser using the Mermaid.js library.
- **Responsive Design**: Fully responsive layout built with Tailwind CSS, ensuring a great experience on any screen size (though desktop-first).

---

## 🛠️ Technology Stack

- **Framework**: React (with Vite)
- **UI Components**: ShadCN/UI
- **Styling**: Tailwind CSS
- **State Management**: React Context or Zustand
- **Data Fetching**: `fetch` API or `react-query`
- **Database Client**: `@supabase/supabase-js`

---

## 📂 Project Structure

A simplified overview of the `/src` directory:

- **`/components`**: Reusable UI components (e.g., buttons, modals, editor).
  - **`/ui`**: Auto-generated components from ShadCN/UI.
- **`/pages`** (or `/views`): The main workspace view and landing page.
- **`/lib`**: Utility functions, including the Supabase client setup.
- **`/hooks`**: Custom React hooks for managing state or side effects.
- **`App.jsx`**: The main application component and router.

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
    - Add your public-facing Supabase credentials:
      ```
      VITE_SUPABASE_URL="your_supabase_project_url"
      VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
      ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).
