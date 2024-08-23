import { CexEntry } from "./cex-entry.model";

export interface CexResults {
    expiry: Date
    cexList: CexEntry[];
}