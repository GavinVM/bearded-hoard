/**
 * Interface representing a CEX entry.
 *
 * @interface CexEntry
 * @property {string} description - The description of the CEX entry.
 * @property {number} cost - The cost of the CEX entry.
 * @property {string} format - The format of the CEX entry.
 * @property {string} cexId - The unique identifier of the CEX entry.
 */
export interface CexEntry {
    description: string;
    cost: number;
    format: string;
    cexId: string;
}
