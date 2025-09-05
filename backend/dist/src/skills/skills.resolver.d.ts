import { SkillsService } from './skills.service';
export declare class SkillsResolver {
    private skillsService;
    constructor(skillsService: SkillsService);
    skills(): Promise<{
        id: string;
        name: string;
    }[]>;
}
