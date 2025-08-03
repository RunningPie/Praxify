# Praxify - Backend API

This directory contains the serverless backend for Praxify, built with Python and deployed on Vercel. The backend is responsible for all core business logic, including interacting with the Gemini AI, performing custom validation, and communicating with the Supabase database.

---

## 🏛️ Project Architecture

The backend follows a serverless architecture, where each API endpoint is a self-contained Python function. This approach ensures scalability, high availability, and zero cold starts on Vercel's edge network.

- **`/api`**: Root directory for all serverless functions.
  - **`elicit.py`**: Handles the initial requirements elicitation logic.
  - **`validate.py`**: Contains the custom validation service for checking ambiguity and completeness.
  - **`visualize.py`**: Manages the generation of architectural diagrams.
  - **`_lib/`**: A shared directory for helper functions or modules used by multiple endpoints.

---

## 🛠️ Technology Stack

- **Runtime**: Python 3.11+
- **Framework**: FastAPI (used for data validation with Pydantic, though not as a traditional server)
- **AI**: Google Gemini API
- **NLP**: NLTK / spaCy (for custom validation logic)
- **Database**: Supabase (via `supabase-py` client)
- **Deployment**: Vercel Serverless Functions

---

## Endpoints

All endpoints are located under the `/api/` path.

#### `POST /api/elicit`
- **Description**: Takes a user's initial project idea and returns AI-generated clarifying questions and user personas.
- **Request Body**: `{ "idea": "User's project idea text..." }`
- **Success Response**: `{ "questions": [...], "personas": [...] }`

#### `POST /api/validate`
- **Description**: Analyzes a requirements document for ambiguous keywords and completeness.
- **Request Body**: `{ "document": "Full requirements text..." }`
- **Success Response**: `{ "issues": [{"type": "ambiguity", "word": "cepat"}, ...] }`

#### `POST /api/visualize`
- **Description**: Generates a C4 Context Diagram from a finalized requirements document.
- **Request Body**: `{ "document": "Final requirements text..." }`
- **Success Response**: `{ "diagram_code": "Mermaid.js syntax for the C4 diagram..." }`

---

## 🚀 How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone [your-repo-url]
    cd [your-repo-url]
    ```

2.  **Set up a Python virtual environment**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up spaCy NER model (for enhanced validation)**
    ```bash
    python setup_spacy.py
    ```
    Or manually:
    ```bash
    python -m spacy download en_core_web_sm
    ```

5.  **Set up environment variables**
    - Create a file named `.env` in the root directory.
    - Add your API keys and Supabase credentials:
      ```
      GEMINI_API_KEY="your_gemini_api_key"
      SUPABASE_URL="your_supabase_project_url"
      SUPABASE_KEY="your_supabase_service_role_key"
      ```

6.  **Run the local development server**
    - You will need the Vercel CLI for this.
    ```bash
    npm install -g vercel
    vercel dev
    ```
    The backend will now be running on `http://localhost:3000`.
