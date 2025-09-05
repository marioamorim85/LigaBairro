export declare class CreateUserInput {
    name: string;
    email: string;
    googleId: string;
    avatarUrl?: string;
    city: string;
    lat?: number;
    lng?: number;
    bio?: string;
}
export declare class UpdateUserInput {
    name?: string;
    bio?: string;
    avatarUrl?: string;
    lat?: number;
    lng?: number;
}
export declare class UpdateUserSkillsInput {
    skillIds: string[];
}
export declare class User {
    id: string;
    name: string;
    email: string;
    googleId: string;
    avatarUrl?: string;
    city: string;
    lat?: number;
    lng?: number;
    bio?: string;
    role: string;
    ratingAvg?: number;
    createdAt: Date;
    updatedAt: Date;
    skills?: UserSkill[];
}
export declare class Skill {
    id: string;
    name: string;
}
export declare class UserSkill {
    userId: string;
    skillId: string;
    skill: Skill;
}
