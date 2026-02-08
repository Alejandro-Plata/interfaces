export type Rank = 'ALL' | 'Academy' | 'D' | 'C' | 'B' | 'A' | 'S';

export type MissionStatus = 'DISPONIBLE' | 'EN_CURSO' | 'COMPLETADA';

export interface NinjaProfile {
    profile: {
        username: string;
        rank: Rank;
        experience: number;
        avatar: string;
    };
    stats: {
        totalAssignments: number;
        completedMissions: number;
    }
}

export interface Ninja {
    id: string;
    username: string;
    rank: Rank;
    experiencePoints: number;
    avatarUrl: string;
}

export interface AuthResponse {
    token: string;
    ninja: Ninja;
    message?: string;
}

export interface MissionsResponse {
    total: number;
    page: number;
    limit: number;
    data: MissionData[];
}

export interface MissionData {
    id: string;
    title: string;
    description: string;
    rankRequirement: Rank;
    reward: number;
    status: MissionStatus;
    acceptedByNinjaName?: string;
    acceptedByNinjaAvatar?: string;
    updatedAt?: string;
}

export interface MissionReport {
    reportText: string;
    evidenceImageUrl: string;
}