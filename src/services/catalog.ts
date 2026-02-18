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
    title: "UGC Mastery",
    description: "Learn to create content that sells and land brand deals.",
    price: 399,
    lessons: [
      { id: "l1", title: "UGC Foundations", durationMinutes: 24 },
      { id: "l2", title: "Pitching Brands", durationMinutes: 31 },
      { id: "l3", title: "Portfolio Framework", durationMinutes: 27 },
    ],
  },
  {
    courseId: "crs_002",
    title: "Dropshipping Profits",
    description: "Launch profitable stores and scale winning products.",
    price: 299,
    lessons: [
      { id: "l1", title: "Winning Product Research", durationMinutes: 34 },
      { id: "l2", title: "Store Setup", durationMinutes: 29 },
      { id: "l3", title: "Offer Testing", durationMinutes: 26 },
    ],
  },
  {
    courseId: "crs_003",
    title: "TikTok Shop Success",
    description: "Build affiliate-driven sales through TikTok Shop.",
    price: 349,
    lessons: [
      { id: "l1", title: "TikTok Commerce Basics", durationMinutes: 21 },
      { id: "l2", title: "Content Hooks", durationMinutes: 25 },
      { id: "l3", title: "Scaling Top Products", durationMinutes: 32 },
    ],
  },
  {
    courseId: "crs_004",
    title: "Build Your Own Platform",
    description: "Create an owned platform and multi-stream revenue engine.",
    price: 449,
    lessons: [
      { id: "l1", title: "Platform Positioning", durationMinutes: 28 },
      { id: "l2", title: "Offer Ladder", durationMinutes: 33 },
      { id: "l3", title: "Audience Monetization", durationMinutes: 35 },
    ],
  },
  {
    courseId: "crs_005",
    title: "PDF Creation & Digital Products",
    description: "Design and sell digital products for recurring income.",
    price: 199,
    lessons: [
      { id: "l1", title: "Idea to Offer", durationMinutes: 19 },
      { id: "l2", title: "Design Workflow", durationMinutes: 22 },
      { id: "l3", title: "Sales Page Conversion", durationMinutes: 25 },
    ],
  },
];

export const PDF_CATALOG: CatalogPDF[] = [
  {
    pdfId: "pdf_001",
    title: "The Creator Revenue Blueprint",
    description: "50-page guide to building 5 income streams.",
    price: 29,
    pages: 50,
  },
  {
    pdfId: "pdf_002",
    title: "UGC Pitch Template Pack",
    description: "Ready-to-send pitch templates for brand deals.",
    price: 19,
    pages: 32,
  },
  {
    pdfId: "pdf_003",
    title: "Dropship Product Cheat Sheet",
    description: "Top product ideas with supplier mapping.",
    price: 14,
    pages: 28,
  },
];

export const MENTORSHIP_CATALOG: CatalogMentorship[] = [
  {
    mentorshipId: "mentorship-2hr",
    title: "1:1 Mentorship with CC Mendel (2hr)",
    description: "Personalized strategy session to accelerate your revenue.",
    price: 950,
    durationMinutes: 120,
  },
];

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
