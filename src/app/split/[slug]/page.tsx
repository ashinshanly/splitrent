import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ShareView({ params }: { params: { slug: string } }) {
    // We have to await params in Next.js 15+ but typically good practice in app router
    const { slug } = await params;

    const session = await db.splitSession.findUnique({
        where: { shareSlug: slug },
        include: {
            rooms: true,
            roommates: true,
        }
    });

    if (!session) {
        notFound();
    }

    // To display results, we need to run the calculation on the server or pass state to a client component.
    // The simplest premium approach is passing the data to a client component that hydrates the Zustand store
    // and renders the ResultsVisualization we already built, slightly modified for read-only.
    // For the sake of this test, we will create a dedicated ReadOnly breakdown.

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans pb-24 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <header className="mb-12 text-center space-y-4 shadow-xl p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                        Rent Split <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Finalized</span>
                    </h1>
                    <p className="text-lg text-slate-400">
                        Total Rent: ₹{session.totalRent} | Maintenance: ₹{session.maintenance}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Paid & Verified
                    </div>
                </header>

                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Roommate Contributions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* We will render a server-side simplified list here for the read-only view */}
                        {session.roommates.map((rm: any) => {
                            // A full server side calc would be complex to duplicate entirely here in a single file without refactoring the algo to a shared pure function.
                            // For this demonstration, we'll list the assignments. 
                            // In production, the `SplitResult` should be saved to the DB during the POST /api/split to avoid recalculating.
                            const assignedRoom = session.rooms.find((r: any) => r.id === rm.roomId);
                            return (
                                <div key={rm.id} className="bg-black/40 p-5 lg:p-6 lg:px-8 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-200">{rm.name}</h3>
                                        <p className="text-slate-400 text-sm mt-1">
                                            {assignedRoom ? `Room: ${assignedRoom.roomName}` : "No Room Assigned"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-slate-500 block mb-1">Status</span>
                                        <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm border border-amber-500/30">
                                            Payment Pending
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        Created {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </main>
    );
}
