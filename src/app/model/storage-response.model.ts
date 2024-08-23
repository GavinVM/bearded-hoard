import { Entry } from "./entry.model";

export interface StorageResponse {
    status: boolean;
    errorMessage?: string;
    item?: any;
}