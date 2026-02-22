"use client";

import { useSplitStore, Room } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

export function RoomConfig() {
    const { rooms, addRoom, updateRoom, removeRoom, calculateSplit } = useSplitStore();

    const handleUpdate = (updater: () => void) => {
        updater();
        setTimeout(calculateSplit, 0);
    };

    const createNewRoom = () => {
        const newRoom: Room = {
            id: crypto.randomUUID(),
            roomName: `Room ${rooms.length + 1}`,
            roomSize: 0,
            privateBathroom: false,
            balcony: false,
            furnishingLevel: 0,
            floorPreference: 0,
            sunlightScore: 0,
        };
        handleUpdate(() => addRoom(newRoom));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Rooms</h2>
                <Button onClick={createNewRoom} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Room
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
                <AnimatePresence>
                    {rooms.map((room) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <AccordionItem value={room.id} className="border-slate-800 bg-black/40 backdrop-blur-md rounded-lg overflow-hidden border px-1">
                                <AccordionTrigger className="hover:no-underline px-4 py-3">
                                    <div className="flex justify-between w-full items-center mr-4">
                                        <span className="font-medium">{room.roomName || "Unnamed Room"}</span>
                                        <span className="text-xs text-slate-400 ml-4 font-normal bg-slate-800/50 px-2 py-1 rounded-full">
                                            {room.roomSize} sq ft
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Room Name</Label>
                                                <Input
                                                    value={room.roomName}
                                                    onChange={(e) => handleUpdate(() => updateRoom(room.id, { roomName: e.target.value }))}
                                                    className="bg-slate-900/50 border-slate-700"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Room Size (sq ft)</Label>
                                                <Input
                                                    type="number"
                                                    value={room.roomSize || ""}
                                                    onChange={(e) => handleUpdate(() => updateRoom(room.id, { roomSize: Number(e.target.value) }))}
                                                    className="bg-slate-900/50 border-slate-700"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                                <Label className="cursor-pointer">Private Bathroom</Label>
                                                <Switch
                                                    checked={room.privateBathroom}
                                                    onCheckedChange={(c) => handleUpdate(() => updateRoom(room.id, { privateBathroom: c }))}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                                <Label className="cursor-pointer">Balcony attached</Label>
                                                <Switch
                                                    checked={room.balcony}
                                                    onCheckedChange={(c) => handleUpdate(() => updateRoom(room.id, { balcony: c }))}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6 bg-slate-900/30 p-4 rounded-lg border border-slate-800/50">
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Label>Furnishing Level</Label>
                                                    <span className="text-xs text-slate-400">{room.furnishingLevel}/5</span>
                                                </div>
                                                <Slider
                                                    min={0} max={5} step={1}
                                                    value={[room.furnishingLevel]}
                                                    onValueChange={([val]) => handleUpdate(() => updateRoom(room.id, { furnishingLevel: val }))}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Label>Floor Preference Score</Label>
                                                    <span className="text-xs text-slate-400">{room.floorPreference}/5</span>
                                                </div>
                                                <Slider
                                                    min={0} max={5} step={1}
                                                    value={[room.floorPreference]}
                                                    onValueChange={([val]) => handleUpdate(() => updateRoom(room.id, { floorPreference: val }))}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Label>Sunlight Score</Label>
                                                    <span className="text-xs text-slate-400">{room.sunlightScore}/5</span>
                                                </div>
                                                <Slider
                                                    min={0} max={5} step={1}
                                                    value={[room.sunlightScore]}
                                                    onValueChange={([val]) => handleUpdate(() => updateRoom(room.id, { sunlightScore: val }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleUpdate(() => removeRoom(room.id))}
                                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Remove Room
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {rooms.length === 0 && (
                    <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-lg">
                        No rooms added yet. Click &quot;Add Room&quot; to begin.
                    </div>
                )}
            </Accordion>
        </div>
    );
}
