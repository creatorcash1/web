import Link from "next/link";

export default async function LiveSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-black text-[#0D1B2A]">Live Session</h1>
        <p className="text-gray-500 mt-2">Session ID: {sessionId}</p>
        <p className="text-sm text-gray-600 mt-4">Join link activation and room auth would run here in production.</p>
        <Link href="/dashboard/live" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase">Back to Live Sessions</Link>
      </div>
    </main>
  );
}
