import Link from "next/link";

export default async function CourseLessonsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-black text-[#0D1B2A]">Course Lessons</h1>
        <p className="text-gray-500 mt-2">Course: {courseId}</p>
        <p className="text-sm text-gray-600 mt-4">Lesson player and progress tracking would load here in production.</p>
        <Link href={`/courses/${courseId}`} className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase">Back to Course</Link>
      </div>
    </main>
  );
}
