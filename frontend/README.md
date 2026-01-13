. Frontend Setup (React + Tailwind)

This section explains how to set up and run the frontend of the project.

1. Navigate to the Frontend Folder

From the project root:

cd frontend

2. Install Node Dependencies

This installs React, Tailwind CSS, routing, icons, API tools, and form handling libraries.

npm install

If some dependencies are missing, install them manually:

npm install react-router-dom lucide-react axios react-hook-form

3. Tailwind CSS Setup
   Step A: Install Tailwind CSS
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

Step B: Configure Tailwind

Open tailwind.config.js and ensure it includes:

content: [
"./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
]

Step C: Add Tailwind Directives

Open src/index.css and add:

@tailwind base;
@tailwind components;
@tailwind utilities;

4. Start the Frontend Server

Run the development server:

npm run dev

Or (if using Create React App):

npm start

The frontend will be available at:

http://localhost:5173

(or http://localhost:3000 for CRA)

5. Frontend Tech Stack

React

Tailwind CSS

React Router

Axios

Lucide React

React Hook Form

Notes

Run npm install only once (unless dependencies change)

Run npm run dev every time you start working

Make sure the backend server is running for API requests
