import type { CLIOptions, ParsedPRUrl, DataMode, PRConsensusOutput } from './types/index.js';
/**
 * Parse PR URL to extract owner, repo, and PR number
 */
export declare function parsePRUrl(input: string): ParsedPRUrl;
/**
 * Determine data mode from CLI options
 */
export declare function getDataMode(options: CLIOptions): DataMode;
/**
 * Main collector function
 */
export declare function collectPRData(prUrl: string, options: CLIOptions): Promise<PRConsensusOutput>;
//# sourceMappingURL=collector.d.ts.map