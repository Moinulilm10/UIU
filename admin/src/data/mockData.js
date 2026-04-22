/**
 * Mock Data for E-Learning Admin Dashboard
 * Contains courses, batches, and students with realistic sample data.
 */

export const courses = [
  { id: 1, title: "Web Development Bootcamp", description: "Master full-stack web development from scratch.", duration: "6 Months", level: "Beginner", batchCount: 1, studentCount: 28 },
  { id: 2, title: "Data Science Fundamentals", description: "Learn data analysis, visualization and modeling.", duration: "4 Months", level: "Intermediate", batchCount: 1, studentCount: 25 },
  { id: 3, title: "UI/UX Design Mastery", description: "Design stunning user interfaces and experiences.", duration: "3 Months", level: "All Levels", batchCount: 1, studentCount: 18 },
  { id: 4, title: "Mobile App Development", description: "Build native mobile apps for iOS and Android.", duration: "5 Months", level: "Intermediate", batchCount: 1, studentCount: 22 },
  { id: 5, title: "Cloud Computing Essentials", description: "Learn AWS, Azure, and Google Cloud platforms.", duration: "4 Months", level: "Advanced", batchCount: 1, studentCount: 20 },
  { id: 6, title: "Machine Learning with Python", description: "Dive deep into AI and predictive algorithms.", duration: "6 Months", level: "Advanced", batchCount: 1, studentCount: 15 },
  { id: 7, title: "Cybersecurity Fundamentals", description: "Protect systems and networks from digital attacks.", duration: "3 Months", level: "Intermediate", batchCount: 1, studentCount: 30 },
  { id: 8, title: "DevOps & CI/CD Pipelines", description: "Automate development and operations workflows.", duration: "4 Months", level: "Advanced", batchCount: 1, studentCount: 12 },
  { id: 9, title: "Blockchain Development", description: "Build decentralized apps and smart contracts.", duration: "5 Months", level: "Intermediate", batchCount: 1, studentCount: 8 },
  { id: 10, title: "Digital Marketing Pro", description: "Grow businesses using SEO, Ads, and Social Media.", duration: "2 Months", level: "Beginner", batchCount: 1, studentCount: 19 },
];

export const batches = [
  { id: 1, name: "Batch Alpha", courseId: 1, courseName: "Web Development Bootcamp", studentCount: 28, maxLimit: 30, status: "open" },
  { id: 2, name: "Batch Beta", courseId: 2, courseName: "Data Science Fundamentals", studentCount: 25, maxLimit: 25, status: "closed" },
  { id: 3, name: "Batch Gamma", courseId: 3, courseName: "UI/UX Design Mastery", studentCount: 18, maxLimit: 30, status: "open" },
  { id: 4, name: "Batch Delta", courseId: 4, courseName: "Mobile App Development", studentCount: 22, maxLimit: 25, status: "open" },
  { id: 5, name: "Batch Epsilon", courseId: 5, courseName: "Cloud Computing Essentials", studentCount: 20, maxLimit: 20, status: "closed" },
  { id: 6, name: "Batch Zeta", courseId: 6, courseName: "Machine Learning with Python", studentCount: 15, maxLimit: 30, status: "open" },
  { id: 7, name: "Batch Eta", courseId: 7, courseName: "Cybersecurity Fundamentals", studentCount: 30, maxLimit: 30, status: "closed" },
  { id: 8, name: "Batch Theta", courseId: 8, courseName: "DevOps & CI/CD Pipelines", studentCount: 12, maxLimit: 20, status: "open" },
  { id: 9, name: "Batch Iota", courseId: 9, courseName: "Blockchain Development", studentCount: 8, maxLimit: 15, status: "open" },
  { id: 10, name: "Batch Kappa", courseId: 10, courseName: "Digital Marketing Pro", studentCount: 19, maxLimit: 25, status: "open" },
];

export const resources = [
  { id: 1, title: "React Basics PDF", type: "pdf", size: "2.4 MB", batchId: 1, uploadedAt: "2024-03-10" },
  { id: 2, title: "Advanced Patterns Video", type: "video", size: "45 MB", batchId: 1, uploadedAt: "2024-03-12" },
  { id: 3, title: "Database Schema Image", type: "image", size: "1.2 MB", batchId: 2, uploadedAt: "2024-03-15" },
];

export const teachers = [
  { 
    id: 1, 
    name: "Dr. Sarah Johnson", 
    email: "sarah.j@university.edu", 
    phone: "+1 (555) 012-3456",
    designation: "Senior Professor",
    department: "Computer Science",
    expertise: ["React", "Node.js", "System Design"],
    joinedAt: "2023-01-15"
  },
  { 
    id: 2, 
    name: "Prof. Michael Chen", 
    email: "m.chen@university.edu", 
    phone: "+1 (555) 987-6543",
    designation: "Associate Professor",
    department: "Mathematics",
    expertise: ["Data Science", "AI", "Python"],
    joinedAt: "2023-05-20"
  },
  { 
    id: 3, 
    name: "Engr. Emily Davis", 
    email: "emily.d@university.edu", 
    phone: "+1 (555) 456-7890",
    designation: "Lecturer",
    department: "Software Engineering",
    expertise: ["UI/UX", "Frontend Dev", "Figma"],
    joinedAt: "2024-02-10"
  }
];

export const students = [
  { id: 1, name: "Arif Rahman", email: "arif.rahman@email.com", batchId: 1, enrolledDate: "2025-01-15" },
  { id: 2, name: "Fatima Begum", email: "fatima.b@email.com", batchId: 1, enrolledDate: "2025-01-16" },
  { id: 3, name: "Tanvir Hossain", email: "tanvir.h@email.com", batchId: 1, enrolledDate: "2025-01-17" },
  { id: 4, name: "Nusrat Jahan", email: "nusrat.j@email.com", batchId: 1, enrolledDate: "2025-01-18" },
  { id: 5, name: "Shakil Ahmed", email: "shakil.a@email.com", batchId: 1, enrolledDate: "2025-01-20" },
  { id: 6, name: "Rasheda Khatun", email: "rasheda.k@email.com", batchId: 2, enrolledDate: "2025-02-01" },
  { id: 7, name: "Imran Khan", email: "imran.k@email.com", batchId: 2, enrolledDate: "2025-02-02" },
  { id: 8, name: "Sumaiya Akter", email: "sumaiya.a@email.com", batchId: 2, enrolledDate: "2025-02-03" },
  { id: 9, name: "Kamal Uddin", email: "kamal.u@email.com", batchId: 2, enrolledDate: "2025-02-05" },
  { id: 10, name: "Maliha Tasnim", email: "maliha.t@email.com", batchId: 3, enrolledDate: "2025-02-10" },
  { id: 11, name: "Rasel Mia", email: "rasel.m@email.com", batchId: 3, enrolledDate: "2025-02-11" },
  { id: 12, name: "Sabrina Islam", email: "sabrina.i@email.com", batchId: 3, enrolledDate: "2025-02-12" },
  { id: 13, name: "Jahangir Alam", email: "jahangir.a@email.com", batchId: 4, enrolledDate: "2025-03-01" },
  { id: 14, name: "Taslima Nasreen", email: "taslima.n@email.com", batchId: 4, enrolledDate: "2025-03-02" },
  { id: 15, name: "Monir Hossain", email: "monir.h@email.com", batchId: 4, enrolledDate: "2025-03-03" },
  { id: 16, name: "Rumi Akter", email: "rumi.a@email.com", batchId: 5, enrolledDate: "2025-03-10" },
  { id: 17, name: "Sajib Das", email: "sajib.d@email.com", batchId: 5, enrolledDate: "2025-03-11" },
  { id: 18, name: "Priya Sen", email: "priya.s@email.com", batchId: 6, enrolledDate: "2025-03-15" },
  { id: 19, name: "Rahim Uddin", email: "rahim.u@email.com", batchId: 6, enrolledDate: "2025-03-16" },
  { id: 20, name: "Jannatul Ferdous", email: "jannatul.f@email.com", batchId: 6, enrolledDate: "2025-03-17" },
  { id: 21, name: "Habib Chowdhury", email: "habib.c@email.com", batchId: 7, enrolledDate: "2025-04-01" },
  { id: 22, name: "Nasima Parvin", email: "nasima.p@email.com", batchId: 7, enrolledDate: "2025-04-02" },
  { id: 23, name: "Anwar Hossain", email: "anwar.h@email.com", batchId: 7, enrolledDate: "2025-04-03" },
  { id: 24, name: "Farhana Yasmin", email: "farhana.y@email.com", batchId: 8, enrolledDate: "2025-04-10" },
  { id: 25, name: "Kamrul Islam", email: "kamrul.i@email.com", batchId: 8, enrolledDate: "2025-04-11" },
  { id: 26, name: "Liton Barua", email: "liton.b@email.com", batchId: 9, enrolledDate: "2025-04-15" },
  { id: 27, name: "Shirin Sultana", email: "shirin.s@email.com", batchId: 9, enrolledDate: "2025-04-16" },
  { id: 28, name: "Rubel Hossain", email: "rubel.h@email.com", batchId: 10, enrolledDate: "2025-04-20" },
  { id: 29, name: "Tamanna Akhter", email: "tamanna.a@email.com", batchId: 10, enrolledDate: "2025-04-21" },
  { id: 30, name: "Belal Ahmed", email: "belal.a@email.com", batchId: 10, enrolledDate: "2025-04-22" },
];

/** Enrollment trend data for the dashboard chart */
export const enrollmentTrends = [
  { month: "Jan", count: 45 },
  { month: "Feb", count: 62 },
  { month: "Mar", count: 78 },
  { month: "Apr", count: 55 },
  { month: "May", count: 90 },
  { month: "Jun", count: 72 },
  { month: "Jul", count: 85 },
  { month: "Aug", count: 98 },
  { month: "Sep", count: 110 },
  { month: "Oct", count: 95 },
  { month: "Nov", count: 120 },
  { month: "Dec", count: 105 },
];

export const subjects = [
  {
    id: 1,
    title: "Web Development",
    description: "Master the art of building modern websites.",
    modules: [
      {
        id: 101,
        title: "Frontend Basics",
        content: "<h1>Introduction to HTML & CSS</h1><p>Learn the foundation of the web.</p>",
        chapters: [
          {
            id: 1001,
            title: "HTML5 Semantic Elements",
            content: "<p>Deep dive into header, footer, article, and section tags.</p>",
            topics: [
              {
                id: 10001,
                title: "Layout with Flexbox",
                content: "<p>Mastering one-dimensional layouts.</p>"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Data Science",
    description: "Extract insights from complex data.",
    modules: []
  }
];

export const assignments = [
  {
    id: "asgn-1",
    title: "Intro to CSS Flexbox",
    description: "Build a responsive layout using Flexbox principles.",
    type: "topic",
    targetId: 10001,
    dueDate: "2024-05-15",
    points: 100,
    status: "active"
  },
  {
    id: "asgn-2",
    title: "React Hooks Masterclass",
    description: "Implement a custom hook for state persistence.",
    type: "module",
    targetId: 101,
    dueDate: "2024-05-20",
    points: 150,
    status: "draft"
  }
];
