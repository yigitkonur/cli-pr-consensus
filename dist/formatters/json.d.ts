import type { PRConsensusOutput } from '../types/index.js';
/**
 * Format output as JSON
 */
export declare function formatAsJSON(data: PRConsensusOutput, pretty?: boolean): string;
/**
 * Format output as NDJSON (newline-delimited JSON) for streaming
 */
export declare function formatAsNDJSON(data: PRConsensusOutput): string;
//# sourceMappingURL=json.d.ts.map