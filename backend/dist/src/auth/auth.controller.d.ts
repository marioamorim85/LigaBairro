import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    googleLogin(): Promise<void>;
    googleCallback(req: any, res: Response): Promise<void>;
    logout(res: Response): Promise<void>;
}
