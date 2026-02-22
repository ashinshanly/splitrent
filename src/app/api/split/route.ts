import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            totalRent,
            maintenance,
            commonAreaSize,
            equalMaintenanceSplit,
            customAmenityWeighting,
            roommates,
            rooms
        } = body;

        const session = await db.splitSession.create({
            data: {
                totalRent,
                maintenance,
                commonAreaSize,
                equalMaintenanceSplit,
                customAmenityWeighting: JSON.stringify(customAmenityWeighting),
                rooms: {
                    create: rooms.map((room: any) => ({
                        roomName: room.roomName,
                        roomSize: room.roomSize,
                        privateBathroom: room.privateBathroom,
                        balcony: room.balcony,
                        furnishingLevel: room.furnishingLevel,
                        viewScore: room.viewScore,
                        sunlightScore: room.sunlightScore,
                    }))
                }
            },
            include: {
                rooms: true,
            }
        });

        // Now create roommates and link to rooms
        // We do this in a second step since rooms are generated with new IDs
        const roommateCreations = roommates.map((rm: any) => {
            // Find the corresponding created room based on a client-side temporary ID or name match
            // For simplicity, assuming the frontend passes the index or name to map back
            const assignedRoom = session.rooms.find((r: any) => r.roomName === rm.roomName);
            return db.roommate.create({
                data: {
                    name: rm.name,
                    splitSessionId: session.id,
                    roomId: assignedRoom?.id || null,
                }
            });
        });

        await Promise.all(roommateCreations);

        const fullSession = await db.splitSession.findUnique({
            where: { id: session.id },
            include: { rooms: true, roommates: true }
        });

        return NextResponse.json(fullSession);
    } catch (error) {
        console.error("Error creating split session:", error);
        return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }
}
