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

        setLoading(true);
        try {
            const response = await fetch('/api/split', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    totalRent: store.totalRent,
                    maintenance: store.maintenance,
                    commonAreaSize: store.commonAreaSize,
                    equalMaintenanceSplit: store.equalMaintenanceSplit,
                    customAmenityWeighting: {
                        sizeWeight: store.sizeWeight,
                        bathroomWeight: store.bathroomWeight,
                        balconyWeight: store.balconyWeight,
                        furnishingWeight: store.furnishingWeight,
                        viewWeight: store.viewWeight,
                        sunlightWeight: store.sunlightWeight,
                    },
                    roommates: store.roommates,
                    rooms: store.rooms,
                })
            });

            if (!response.ok) throw new Error("Failed to save");

            const data = await response.json();

            // Simulate Payment flow opening
            toast.loading("Processing payment...", { id: "payment" });

            // Mock payment success
            const paymentResponse = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: data.id })
            });

            if (paymentResponse.ok) {
                setHasUnlockedPremium(true);
                // Trigger a sync recalculation now that it's unlocked so they see values apply before redirecting
                store.calculateSplit();
                toast.success("Payment successful! Premium Modifiers unlocked.", { id: "payment" });
                toast.info("Your permanent digital receipt has been generated.", {
                    description: `${window.location.origin}/split/${data.shareSlug}`,
                    duration: 10000,
                    action: {
                        label: "Copy Link",
                        onClick: () => {
                            navigator.clipboard.writeText(`${window.location.origin}/split/${data.shareSlug}`);
                            toast.success("Link copied to clipboard!");
                        }
                    }
                });
            }

        } catch (error) {
            console.error(error);
            toast.error("Error generating shareable link.", { id: "payment" });
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
                        <Share2 className="w-4 h-4 mr-2" />
                        Regenerate Receipt
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock Premium & Share
                        <Share2 className="w-4 h-4 ml-2 opacity-70" />
                    </>
                )}
            </span>
        </Button>
    );
}
