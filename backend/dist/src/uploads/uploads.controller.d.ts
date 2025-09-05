import { Response } from 'express';
import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private uploadsService;
    constructor(uploadsService: UploadsService);
    uploadAvatar(file: Express.Multer.File, user: any): Promise<{
        url: string;
        filename: string;
        message: string;
    }>;
    uploadRequestImage(file: Express.Multer.File, user: any): Promise<{
        url: string;
        filename: string;
        message: string;
    }>;
    getFile(filename: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
