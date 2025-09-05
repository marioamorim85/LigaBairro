import { User } from '../../users/dto/user.dto';
import { Request } from '../../requests/dto/request.dto';
export declare enum ApplicationStatus {
    APPLIED = "APPLIED",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}
export declare class ApplyToRequestInput {
    requestId: string;
    message?: string;
}
export declare class Application {
    id: string;
    requestId: string;
    helperId: string;
    message?: string;
    status: ApplicationStatus;
    createdAt: Date;
    request?: Request;
    helper?: User;
}
export declare class RemoveApplicationResult {
    id: string;
    success: boolean;
    message: string;
}
