# Global Link Imports - Frontend

This is the React-based frontend for the Global Link Imports management system. Built with Vite and Tailwind CSS, it provides a high-performance, responsive interface for managing logistics.

## Tech Stack

- **React 19:** Component-based UI library.
- **Vite:** Next-generation frontend tooling for fast development.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **React Router 7:** Declarative routing for React.
- **Axios:** Promise-based HTTP client for API requests.
- **Lucide React:** Beautifully simple icons.

---

##  Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Run the development server with hot-module replacement:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Production Build
Create an optimized production build:
```bash
npm run build
```
The output will be in the `dist/` folder.

---

##  Project Structure

```text
src/
├── assets/             # Static assets (images, fonts)
├── components/         # Reusable UI components
├── contexts/           # React Context providers (Auth, etc.)
├── hooks/              # Custom React hooks
├── pages/              # Page components (Dashboard, Login, etc.)
├── services/           # API service modules
├── App.jsx             # Root component
└── main.jsx            # Application entry point
```

---

##  Styling Guidelines

We use **Tailwind CSS** for all styling. 
- Custom configurations can be found in `tailwind.config.js`.
- Component-specific styles should be handled via Tailwind classes directly in JSX.
- Global styles and Tailwind directives are in `src/index.css`.

---
##  Linting

To maintain code quality, we use ESLint:
```bash
npm run lint
```
