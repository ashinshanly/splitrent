"use client";

import { useSplitStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GlobalConfig() {
    const {
        totalRent,
        maintenance,
        totalHouseSize,
        commonAreaSize,
        equalMaintenanceSplit,
        setTotalRent,
        setMaintenance,
        setTotalHouseSize,
        setCommonAreaSize,
        setEqualMaintenanceSplit,
        calculateSplit,
    } = useSplitStore();

    const handleUpdate = (updater: () => void) => {
        updater();
        // Use a slight timeout to batch state updates before calculation if needed, 
        // but Zustand is usually synchronous enough here if we just call it.
        setTimeout(calculateSplit, 0);
    };

    return (
        <Card className="bg-black/40 border-slate-800 backdrop-blur-md shadow-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    House Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="totalRent">Total Monthly Rent</Label>
                        <Input
                            id="totalRent"
                            type="number"
                            min="0"
                            placeholder="e.g. 50000"
                            value={totalRent || ""}
                            onChange={(e) => handleUpdate(() => setTotalRent(Number(e.target.value)))}
                            className="bg-slate-900/50 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maintenance">Monthly Maintenance</Label>
                        <Input
                            id="maintenance"
                            type="number"
                            min="0"
                            placeholder="e.g. 5000"
                            value={maintenance || ""}
                            onChange={(e) => handleUpdate(() => setMaintenance(Number(e.target.value)))}
                            className="bg-slate-900/50 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="totalHouseSize">Total House Size (sq ft)</Label>
                        <Input
                            id="totalHouseSize"
                            type="number"
                            min="0"
                            placeholder="e.g. 1500"
                            value={totalHouseSize || ""}
                            onChange={(e) => handleUpdate(() => setTotalHouseSize(Number(e.target.value)))}
                            className="bg-slate-900/50 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="commonAreaSize">Common Area Size (sq ft)</Label>
                        <Input
                            id="commonAreaSize"
                            type="number"
                            min="0"
                            placeholder="e.g. 500"
                            value={commonAreaSize || ""}
                            onChange={(e) => handleUpdate(() => setCommonAreaSize(Number(e.target.value)))}
                            className="bg-slate-900/50 border-slate-700"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 p-4 rounded-lg bg-slate-900/30 border border-slate-800">
                    <div className="space-y-0.5">
                        <Label htmlFor="equalMaintenance">Equal Maintenance Split</Label>
                        <p className="text-sm text-slate-400">
                            Split maintenance equally instead of by room proportion
                        </p>
                    </div>
                    <Switch
                        id="equalMaintenance"
                        checked={equalMaintenanceSplit}
                        onCheckedChange={(checked) => handleUpdate(() => setEqualMaintenanceSplit(checked))}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
