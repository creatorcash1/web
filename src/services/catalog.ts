export interface CatalogCourse {
  courseId: string;
  title: string;
  description: string;
  price: number;
  lessons: { id: string; title: string; durationMinutes: number }[];
  thumbnailUrl?: string;
}

export interface CatalogPDF {
  pdfId: string;
  title: string;
  description: string;
  price: number;
  pages: number;
}

export interface CatalogMentorship {
  mentorshipId: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export const COURSE_CATALOG: CatalogCourse[] = [
  {
    courseId: "crs_001",
    title: "How to Turn What You Know Into $10k Monthly",
    description: "Master the complete system for transforming your knowledge and skills into consistent $10,000+ monthly income. Includes 2 step-by-step video trainings and 1 comprehensive implementation ebook.",
    price: 57.99,
    lessons: [
      { id: "l1", title: "Foundation: Building Your $10k System", durationMinutes: 45 },
      { id: "l2", title: "Execution: Scaling to Consistent Revenue", durationMinutes: 52 },
      { id: "l3", title: "Implementation Ebook: Your Complete Action Plan", durationMinutes: 0 },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
  },
];

// PDFs will be added later
export const PDF_CATALOG: CatalogPDF[] = [];

// Mentorship will be added later
export const MENTORSHIP_CATALOG: CatalogMentorship[] = [];

export async function fetchCourseById(courseId: string): Promise<CatalogCourse | null> {
  const response = await fetch(`/api/courses/${courseId}`);
  if (!response.ok) return null;
  return response.json();
}

export async function fetchPDFById(pdfId: string): Promise<CatalogPDF | null> {
  const response = await fetch(`/api/pdfs/${pdfId}`);
  if (!response.ok) return null;
  return response.json();
}

export async function fetchMentorshipById(mentorshipId: string): Promise<CatalogMentorship | null> {
  const response = await fetch(`/api/mentorship/${mentorshipId}`);
  if (!response.ok) return null;
  return response.json();
}
