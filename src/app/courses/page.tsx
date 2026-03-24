import Link from "next/link";
import { COURSE_CATALOG } from "@/services/catalog";
import UserAppShell from "@/components/user/UserAppShell";

export default function CoursesPage() {
  return (
    <UserAppShell>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-[#0D1B2A] mb-2">Courses</h1>
        <p className="text-gray-500 mb-8">Explore premium programs and start learning.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {COURSE_CATALOG.map((course) => (
            <article key={course.courseId} className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#0D1B2A]">{course.title}</h2>
              <p className="text-sm text-gray-500 mt-2 min-h-12">{course.description}</p>
              <p className="text-xl font-black text-[#FFC857] mt-4">${course.price}</p>
              <div className="mt-4 flex gap-2">
                <Link href={`/courses/${course.courseId}`} className="px-4 py-2 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase">Enroll Now</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </UserAppShell>
  );
}
