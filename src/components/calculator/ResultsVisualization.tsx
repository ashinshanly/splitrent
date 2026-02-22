"use client";

import { useSplitStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { motion } from "framer-motion";

export function ResultsVisualization() {
    const { results, totalRent, maintenance } = useSplitStore();

    if (results.length === 0) return null;

    // Calculate totals to verify match
    const totalCalculated = results.reduce((sum, r) => sum + r.totalPayable, 0);
    const targetTotal = totalRent + maintenance;
    const isBalanced = Math.abs(totalCalculated - targetTotal) < 0.05; // allow slight float rounding if any internally

    const chartData = results.map(r => ({
        name: r.roommateName,
        CommonArea: Number(r.commonAreaRentShare.toFixed(2)),
        PrivateRoom: Number(r.privateRoomRentShare.toFixed(2)),
        Maintenance: Number(r.maintenanceShare.toFixed(2)),
        Total: Number(r.totalPayable.toFixed(2))
    }));

    const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6'];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
        >
            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                <CardHeader>
                    <CardTitle className="flex justify-between items-center text-xl">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Final Split Breakdown
                        </span>
                        {isBalanced ? (
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                                Perfectly Balanced
                            </span>
                        ) : (
                            <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30">
                                Mismatch Deteched ({totalCalculated} vs {targetTotal})
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    <div className="h-72 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" stroke="#475569" tick={{ fill: '#94a3b8' }} />
                                <YAxis dataKey="name" type="category" stroke="#475569" tick={{ fill: '#e2e8f0' }} width={100} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Legend />
                                <Bar dataKey="PrivateRoom" stackId="a" fill="#6366f1" name="Private Room" radius={[0, 0, 0, 4]} />
                                <Bar dataKey="CommonArea" stackId="a" fill="#8b5cf6" name="Common Area" />
                                <Bar dataKey="Maintenance" stackId="a" fill="#14b8a6" name="Maintenance" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((r, i) => (
                            <div key={r.roommateId} className="bg-black/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-semibold text-slate-200">{r.roommateName}</span>
                                    <span className="text-xs px-2 py-1 bg-slate-800 rounded-md text-slate-400">{r.roomName || "No Room"}</span>
                                </div>

                                <div className="space-y-1 text-sm text-slate-400">
                                    <div className="flex justify-between">
                                        <span>Room:</span>
                                        <span className="text-slate-300">₹{r.privateRoomRentShare.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Common:</span>
                                        <span className="text-slate-300">₹{r.commonAreaRentShare.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Maint:</span>
                                        <span className="text-slate-300">₹{r.maintenanceShare.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-lg font-bold">
                                    <span className="text-indigo-400">Total</span>
                                    <span className="text-white">₹{r.totalPayable.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </CardContent>
            </Card>
        </motion.div>
    );
}
