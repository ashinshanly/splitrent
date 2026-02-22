import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId } = body;

        // In a real implementation with Razorpay/Stripe, we would create an order here
        // and return the order ID to the client.

        // Mock implementation: just mark the session as paid immediately
        const session = await db.splitSession.update({
            where: { id: sessionId },
            data: { paid: true }
        });

        return NextResponse.json({ success: true, session });
    } catch (error) {
        console.error("Error processing mock payment:", error);
        return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
    }
}
