"use client";

import { useSplitStore, Roommate } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RoommateConfig() {
    const { roommates, rooms, addRoommate, updateRoommate, removeRoommate, calculateSplit } = useSplitStore();

    const handleUpdate = (updater: () => void) => {
        updater();
        setTimeout(calculateSplit, 0);
    };

    const createNewRoommate = () => {
        const newRm: Roommate = {
            id: crypto.randomUUID(),
            name: `Roommate ${roommates.length + 1}`,
            roomId: null, // Unassigned by default
        };
        handleUpdate(() => addRoommate(newRm));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Roommates</h2>
                <Button onClick={createNewRoommate} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Roommate
                </Button>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {roommates.map((rm) => (
                        <motion.div
                            key={rm.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col md:flex-row gap-4 lg:gap-8 p-4 lg:p-6 rounded-lg bg-black/40 border border-slate-800 backdrop-blur-md items-center"
                        >
                            <div className="flex items-center gap-3 w-full md:w-auto md:flex-1">
                                <div className="bg-slate-800 p-2 rounded-full hidden md:block">
                                    <User className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        value={rm.name}
                                        onChange={(e) => handleUpdate(() => updateRoommate(rm.id, { name: e.target.value }))}
                                        className="bg-slate-900/50 border-slate-700 h-10 lg:h-12 lg:text-lg font-medium"
                                        placeholder="Name"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto md:flex-1">
                                <div className="flex-1 w-full">
                                    <select
                                        className="flex h-10 lg:h-12 w-full lg:text-base items-center justify-between whitespace-nowrap rounded-md border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={rm.roomId || ""}
                                        onChange={(e) => handleUpdate(() => updateRoommate(rm.id, { roomId: e.target.value || null }))}
                                    >
                                        <option value="">-- Assign a Room --</option>
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.roomName || "Unnamed Room"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleUpdate(() => removeRoommate(rm.id))}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 lg:h-12 lg:w-12 h-10 w-10 ml-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {roommates.length === 0 && (
                    <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-lg">
                        No roommates added yet. Click &quot;Add Roommate&quot; to begin.
                    </div>
                )}
            </div>
        </div>
    );
}
