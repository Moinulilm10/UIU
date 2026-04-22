# Prompt: Professional React Admin Dashboard (Course & Batch Management)

## Role & Technical Stack
You are a Senior Frontend Engineer and UI/UX Designer. Build a modern, interactive Admin Dashboard using:
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (Custom Theme)
- **Routing:** react-router-dom
- **Icons:** Lucide-react
- **Animations:** Framer Motion (for smooth transitions/transforms)

## Design Language & Theme
- **Primary Color:** `#E29B41` (Use as primary buttons, active states, accents).
- **Style:** Modern Glassmorphism or Clean Flat design with soft shadows (`shadow-sm` to `shadow-lg`).
- **Feel:** Eye-catching, professional, high-contrast typography, and spacious padding.
- **Responsiveness:** Mobile-first approach, sidebar collapses to a hamburger menu on small screens.

## 1. Data Architecture (mockData.js)
Create a separate `mockData.js` file with:
- `batches`: Array of objects { id, name, courseName, studentCount, maxLimit, status: 'open'|'closed' }.
- `students`: Array of objects { id, name, email, batchId, enrolledDate }.

## 2. Reusable UI Components
Break the UI into these atomic pieces:
- `Button.jsx`: Variants (primary, secondary, danger, ghost).
- `Card.jsx`: Container with hover animation `hover:-translate-y-1 transition-transform`.
- `Badge.jsx`: For batch status (Open/Full).
- `Modal.jsx`: For Create/Edit/Migrate actions.
- `Pagination.jsx`: Functional pagination component.
- `Input.jsx`: Standardized themed inputs.

## 3. Layout & Routing
- Create a `MainLayout.jsx` with a fixed Sidebar and a scrollable Header/Content area.
- Use `Outlet` for nested routes.
- Sidebar links: Dashboard (Analytics), Batch Management, Students, Settings.

## 4. Key Views & Features

### A. Dashboard (Analytics)
- Stats Cards: Total Batches, Total Students, Revenue, Active Courses.
- Include simple SVG-based or CSS-based bar charts representing enrollment trends.

### B. Batch Management View
- **List/Grid View:** Display batches with progress bars showing `studentCount / maxLimit`.
- **Logic:** If `studentCount >= maxLimit`, automatically set status to 'Closed' and disable "Join" button.
- **Actions:** Buttons for Edit Batch, Delete Batch, and View Students.

### C. Student Migration & Management
- Display a table of students under a specific batch with pagination.
- **Migration Feature:** A "Migrate" button on a student row that opens a Modal with a dropdown of other available batches.
- **Validation:** Prevent migration if the target batch is at its `maxLimit`.

## 5. Interactions & UX
- Use `framer-motion` for page transitions and Modal fades.
- Implement hover effects on table rows and action icons.
- Use `transition-all duration-300` for all state changes.

## 6. Development Instructions
1.  Start by providing the `mockData.js`.
2.  Provide the `MainLayout.jsx` and Sidebar implementation.
3.  Implement the `BatchCard` and `BatchList` components.
4.  Implement the `StudentTable` with the Migration logic.
5.  Ensure all styles use Tailwind utility classes exclusively.
6.  Ensure the code is clean, documented, and uses functional components with hooks.

---
**Output requirement:** Provide the code in modular blocks. Do not dump all code into one file. Organize by folder structure (components/, layout/, pages/, data/).
