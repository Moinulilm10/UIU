/**
 * Mock Data for E-Learning Admin Dashboard
 * Contains batches and students with realistic sample data.
 */

export const batches = [
  { id: 1, name: "Batch Alpha", courseName: "Web Development Bootcamp", studentCount: 28, maxLimit: 30, status: "open" },
  { id: 2, name: "Batch Beta", courseName: "Data Science Fundamentals", studentCount: 25, maxLimit: 25, status: "closed" },
  { id: 3, name: "Batch Gamma", courseName: "UI/UX Design Mastery", studentCount: 18, maxLimit: 30, status: "open" },
  { id: 4, name: "Batch Delta", courseName: "Mobile App Development", studentCount: 22, maxLimit: 25, status: "open" },
  { id: 5, name: "Batch Epsilon", courseName: "Cloud Computing Essentials", studentCount: 20, maxLimit: 20, status: "closed" },
  { id: 6, name: "Batch Zeta", courseName: "Machine Learning with Python", studentCount: 15, maxLimit: 30, status: "open" },
  { id: 7, name: "Batch Eta", courseName: "Cybersecurity Fundamentals", studentCount: 30, maxLimit: 30, status: "closed" },
  { id: 8, name: "Batch Theta", courseName: "DevOps & CI/CD Pipelines", studentCount: 12, maxLimit: 20, status: "open" },
  { id: 9, name: "Batch Iota", courseName: "Blockchain Development", studentCount: 8, maxLimit: 15, status: "open" },
  { id: 10, name: "Batch Kappa", courseName: "Digital Marketing Pro", studentCount: 19, maxLimit: 25, status: "open" },
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
