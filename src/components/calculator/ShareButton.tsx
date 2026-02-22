"use client";

import { useSplitStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Share2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// To keep the code clean inline:

export function ShareButton() {
    const [loading, setLoading] = useState(false);
    const store = useSplitStore();
    const { hasUnlockedPremium, setHasUnlockedPremium } = store;

    const handleAction = async () => {
        if (store.results.length === 0) {
            toast.error("Please configure rooms and roommates to calculate a split first.");
            return;
        }

        if (hasUnlockedPremium) {
            toast.info("Premium is already unlocked!");
            return;
        }

        setLoading(true);
        try {
            // Simulate Payment flow opening locally
            toast.loading("Processing mockup payment...", { id: "payment" });

            // Mock network latency for the payment simulator
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setHasUnlockedPremium(true);
            // Trigger a sync recalculation now that it's unlocked
            store.calculateSplit();
            toast.success("Payment successful! Premium Modifiers unlocked.", { id: "payment" });
        } catch (error) {
            console.error(error);
            toast.error("Error unlocking premium.", { id: "payment" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleAction}
            disabled={loading || store.results.length === 0}
            size="lg"
            className={`w-full sm:w-auto text-white shadow-lg border-none group relative overflow-hidden ${hasUnlockedPremium
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/25"
                }`}
        >
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-in-out -translate-x-full z-0" />
            <span className="relative z-10 flex items-center">
                {loading ? (
                    "Processing..."
                ) : hasUnlockedPremium ? (
                    <>
                        <Lock className="w-4 h-4 mr-2 opacity-50" />
                        Premium Unlocked
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock Premium Modifiers
                    </>
                )}
            </span>
        </Button>
    );
}
