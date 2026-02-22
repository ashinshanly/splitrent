import { create } from 'zustand';

export interface Room {
    id: string; // Front-end temp id
    roomName: string;
    roomSize: number;
    privateBathroom: boolean;
    balcony: boolean;
    furnishingLevel: number;
    floorPreference: number;
    sunlightScore: number;
}

export interface Roommate {
    id: string; // Front-end temp id
    name: string;
    roomId: string | null;
}

export interface SplitResult {
    roommateId: string;
    roommateName: string;
    roomId: string | null;
    roomName: string | null;
    commonAreaRentShare: number;
    privateRoomRentShare: number;
    maintenanceShare: number;
    totalPayable: number;
}

interface SplitStoreState {
    totalRent: number;
    maintenance: number;
    totalHouseSize: number;
    commonAreaSize: number;
    equalMaintenanceSplit: boolean;

    // Weights (Customizable)
    sizeWeight: number;
    bathroomWeight: number;
    balconyWeight: number;
    furnishingWeight: number; // multiplier per level
    floorWeight: number;      // multiplier per level
    sunlightWeight: number;   // multiplier per level

    rooms: Room[];
    roommates: Roommate[];
    results: SplitResult[];

    // Actions
    setTotalRent: (val: number) => void;
    setMaintenance: (val: number) => void;
    setTotalHouseSize: (val: number) => void;
    setCommonAreaSize: (val: number) => void;
    setEqualMaintenanceSplit: (val: boolean) => void;

    addRoom: (room: Room) => void;
    updateRoom: (id: string, updates: Partial<Room>) => void;
    removeRoom: (id: string) => void;

    addRoommate: (roommate: Roommate) => void;
    updateRoommate: (id: string, updates: Partial<Roommate>) => void;
    removeRoommate: (id: string) => void;

    calculateSplit: () => void;
}

// Ensure Banker's Rounding (Round half to even)
function bankersRound(num: number): number {
    const rounded = Math.round(num);
    const isHalfway = Math.abs(num % 1) === 0.5;
    if (isHalfway) {
        return rounded % 2 === 0 ? rounded : rounded - 1;
    }
    return rounded;
}

export const useSplitStore = create<SplitStoreState>((set, get) => ({
    totalRent: 0,
    maintenance: 0,
    totalHouseSize: 0,
    commonAreaSize: 0,
    equalMaintenanceSplit: true,

    sizeWeight: 1,
    bathroomWeight: 500,  // Base flat addition weight
    balconyWeight: 300,   // Base flat addition weight
    furnishingWeight: 100, // per level 1-5
    floorWeight: 50,      // per level 1-5
    sunlightWeight: 50,   // per level 1-5

    rooms: [],
    roommates: [],
    results: [],

    setTotalRent: (v) => set({ totalRent: v }),
    setMaintenance: (v) => set({ maintenance: v }),
    setTotalHouseSize: (v) => set({ totalHouseSize: v }),
    setCommonAreaSize: (v) => set({ commonAreaSize: v }),
    setEqualMaintenanceSplit: (v) => set({ equalMaintenanceSplit: v }),

    addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
    updateRoom: (id, updates) => set((state) => ({
        rooms: state.rooms.map(r => r.id === id ? { ...r, ...updates } : r)
    })),
    removeRoom: (id) => set((state) => {
        // Also unassign roommates in this room
        const newRoommates = state.roommates.map(rm =>
            rm.roomId === id ? { ...rm, roomId: null } : rm
        );
        return {
            rooms: state.rooms.filter(r => r.id !== id),
            roommates: newRoommates
        };
    }),

    addRoommate: (roommate) => set((state) => ({ roommates: [...state.roommates, roommate] })),
    updateRoommate: (id, updates) => set((state) => ({
        roommates: state.roommates.map(rm => rm.id === id ? { ...rm, ...updates } : rm)
    })),
    removeRoommate: (id) => set((state) => ({ roommates: state.roommates.filter(rm => rm.id !== id) })),

    calculateSplit: () => {
        const state = get();
        const numRoommates = state.roommates.length;

        if (numRoommates === 0 || state.totalRent <= 0) {
            set({ results: [] });
            return;
        }

        // Step 1: Common Area Split
        // Ratio of house that is common
        const houseSize = state.totalHouseSize > 0 ? state.totalHouseSize : 1;
        let commonRatio = state.commonAreaSize / houseSize;
        if (commonRatio > 1) commonRatio = 1;

        const totalCommonAreaRent = state.totalRent * commonRatio;
        const commonAreaRentPerPerson = totalCommonAreaRent / numRoommates;

        // Remaining rent is for private rooms
        const remainingRentForRooms = state.totalRent - totalCommonAreaRent;

        // Step 2: Calculate Room Weights
        // A room's score is a basis for its relational value vs other rooms
        let totalRoomWeight = 0;

        // Map rooms to their computed weights
        const roomWeights: Record<string, number> = {};

        state.rooms.forEach(room => {
            let weight = (room.roomSize * state.sizeWeight)
                + (room.privateBathroom ? state.bathroomWeight : 0)
                + (room.balcony ? state.balconyWeight : 0)
                + (room.furnishingLevel * state.furnishingWeight)
                + (room.floorPreference * state.floorWeight)
                + (room.sunlightScore * state.sunlightWeight);

            roomWeights[room.id] = weight;
            totalRoomWeight += weight;
        });

        // Step 3: Compute final distribution
        const results: SplitResult[] = [];

        // We must track the exact sum to handle rounding errors deterministically
        let runningCalculatedRent = 0;
        let runningCalculatedMaintenance = 0;

        state.roommates.forEach((rm, index) => {
            const room = state.rooms.find(r => r.id === rm.roomId);

            let privateRoomRentShare = 0;
            let maintenanceShare = 0;

            // Handle equal vs proportionate maintenance
            if (state.equalMaintenanceSplit) {
                maintenanceShare = state.maintenance / numRoommates;
            }

            if (room) {
                // Find how many people share THIS specific room
                const peopleInThisRoom = state.roommates.filter(r => r.roomId === room.id).length;

                if (totalRoomWeight > 0) {
                    // Proportion of the remaining rent that belongs to this room
                    const roomTotalRent = remainingRentForRooms * (roomWeights[room.id] / totalRoomWeight);
                    privateRoomRentShare = roomTotalRent / peopleInThisRoom;

                    if (!state.equalMaintenanceSplit) {
                        // Maintenance based on room weight proportion
                        const roomMaintenance = state.maintenance * (roomWeights[room.id] / totalRoomWeight);
                        maintenanceShare = roomMaintenance / peopleInThisRoom;
                    }
                }
            } else {
                // Not assigned a room, they just pay common area + equal maintenance
                if (!state.equalMaintenanceSplit) {
                    maintenanceShare = 0; // If they have no weight and we do proportionate, they pay 0
                }
            }

            // We apply bankers Rounding individually to the cents (or rupees, etc. assuming whole integer inputs for now)
            // For precision, we'll round final payable.

            let finalCommon = commonAreaRentPerPerson;
            let finalPrivate = privateRoomRentShare;
            let finalMaintenance = maintenanceShare;

            // On the LAST person, adjust for rounding errors to ensure absolute sum
            if (index === numRoommates - 1) {
                const expectedTotalRentSoFar = state.totalRent - runningCalculatedRent;
                const remainingRentForLastPerson = expectedTotalRentSoFar;

                finalCommon = bankerRoundFraction(commonAreaRentPerPerson);
                finalPrivate = remainingRentForLastPerson - finalCommon;

                const expectedTotalMaintenanceSoFar = state.maintenance - runningCalculatedMaintenance;
                finalMaintenance = expectedTotalMaintenanceSoFar;
            } else {
                finalCommon = bankerRoundFraction(commonAreaRentPerPerson);
                finalPrivate = bankerRoundFraction(privateRoomRentShare);
                finalMaintenance = bankerRoundFraction(maintenanceShare);

                runningCalculatedRent += (finalCommon + finalPrivate);
                runningCalculatedMaintenance += finalMaintenance;
            }

            results.push({
                roommateId: rm.id,
                roommateName: rm.name,
                roomId: room?.id || null,
                roomName: room?.roomName || null,
                commonAreaRentShare: Math.max(0, finalCommon), // Ensure no negative edge cases
                privateRoomRentShare: Math.max(0, finalPrivate),
                maintenanceShare: Math.max(0, finalMaintenance),
                totalPayable: Math.max(0, finalCommon + finalPrivate + finalMaintenance)
            });
        });

        set({ results });
    }
}));

// Helper to round to 2 decimal places if needed, but for Rent Splitter, integer representation is often best for standard currencies if not using cents. We'll round to 2 decimals.
function bankerRoundFraction(num: number): number {
    return bankersRound(num * 100) / 100;
}
