import { ConfigService } from '@nestjs/config';
export declare class UploadsService {
    private configService;
    private readonly logger;
    private readonly uploadDir;
    private readonly maxFileSize;
    private readonly allowedMimeTypes;
    constructor(configService: ConfigService);
    private ensureUploadDir;
    uploadImage(file: Express.Multer.File, options?: {
        width?: number;
        height?: number;
        quality?: number;
    }): Promise<{
        url: string;
        filename: string;
    }>;
    uploadAvatar(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadRequestImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    deleteImage(filename: string): Promise<void>;
    private validateFile;
    getFilePath(filename: string): string;
}
