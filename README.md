# Global Link Imports

Logistics and tracking application designed to manage shipments, tracking, and user roles efficiently.

---

## Frontend Setup (React + Tailwind)

This section explains how to set up and run the frontend of the project.

### 1. Navigate to the Frontend Folder
From the project root directory:
```bash
cd frontend
2. Install Node Dependencies
This installs React, Tailwind CSS, routing, icons, API tools, and form handling libraries.

npm install
If some dependencies are missing or you run into issues, you can install the core packages manually:

npm install react-router-dom lucide-react axios react-hook-form
3. Tailwind CSS Setup
Step A: Install Tailwind CSS

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
Step B: Configure Tailwind Open tailwind.config.js and ensure it looks like this:

JavaScript

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
Step C: Add Tailwind Directives Open src/index.css and ensure the top three lines are:

CSS

@tailwind base;
@tailwind components;
@tailwind utilities;
4. Start the Frontend Server
Run the development server:

Bash

npm run dev
Or (if using Create React App):

Bash

npm start
The frontend will be available at:

Vite: http://localhost:5173

CRA: http://localhost:3000

5. Frontend Tech Stack
Framework: React

Styling: Tailwind CSS

Routing: React Router DOM

HTTP Client: Axios

Icons: Lucide React

Forms: React Hook Form

Notes
Run npm install only once (unless dependencies change in package.json).

Run npm run dev every time you start working to launch the app.

Crucial: Make sure the backend server is running separately for API requests to work.