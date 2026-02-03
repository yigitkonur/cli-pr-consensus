#!/usr/bin/env node
// ============================================
// PR Consensus - CLI Entry Point
// ============================================

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { writeFileSync } from 'fs';

import type { CLIOptions, OutputFormat } from './types/index.js';
import { collectPRData, parsePRUrl, getDataMode } from './collector.js';
import { formatAsJSON } from './formatters/json.js';
import { formatAsYAML } from './formatters/yaml.js';
import { formatAsMarkdown } from './formatters/markdown.js';
import { formatAsConsensus } from './formatters/consensus.js';

const VERSION = '1.0.0';

const program = new Command();

program
  .name('pr-consensus')
  .description('Ultimate GitHub PR data collector with LLM-optimized output')
  .version(VERSION)
  .argument('<url>', 'GitHub PR URL (https://github.com/owner/repo/pull/123) or owner/repo/123')
  .option('--code', 'Include diffs only (no comments)')
  .option('--full', 'Include both comments and diffs')
  .option('-f, --format <type>', 'Output format: json, yaml, md, consensus', 'json')
  .option('-t, --template <file>', 'Custom Go template for md format')
  .option('-o, --output <file>', 'Write to file instead of stdout')
  .option('--include-diff', 'Include diff in normal mode')
  .option('--no-filter', 'Disable noise filtering')
  .option('--filter-file <file>', 'Custom filter patterns file')
  .option('-v, --verbose', 'Show progress and debug info')
  .option('-q, --quiet', 'Suppress all non-data output')
  .action(async (url: string, options: Record<string, unknown>) => {
    const cliOptions: CLIOptions = {
      code: Boolean(options.code),
      full: Boolean(options.full),
      format: (options.format as OutputFormat) || 'json',
      template: options.template as string | undefined,
      output: options.output as string | undefined,
      includeDiff: Boolean(options.includeDiff),
      noFilter: !options.filter, // --no-filter sets filter to false
      filterFile: options.filterFile as string | undefined,
      verbose: Boolean(options.verbose),
      quiet: Boolean(options.quiet),
    };

    await run(url, cliOptions);
  });

async function run(url: string, options: CLIOptions): Promise<void> {
  const spinner = options.quiet ? null : ora();

  try {
    // Validate URL
    const pr = parsePRUrl(url);

    if (!options.quiet) {
      spinner?.start(
        chalk.blue(`Fetching PR #${pr.number} from ${pr.owner}/${pr.repo}...`)
      );
    }

    // Collect data
    const data = await collectPRData(url, options);

    if (!options.quiet) {
      spinner?.succeed(
        chalk.green(`Fetched PR #${pr.number}: ${data.pr.title}`)
      );
    }

    // Format output
    let output: string;
    const mode = getDataMode(options);

    switch (options.format) {
      case 'yaml':
        output = formatAsYAML(data);
        data.meta.format = 'yaml';
        break;

      case 'md':
        output = formatAsMarkdown(data, options.template);
        data.meta.format = 'md';
        break;

      case 'consensus':
        output = formatAsConsensus(data);
        data.meta.format = 'consensus';
        break;

      case 'json':
      default:
        output = formatAsJSON(data);
        data.meta.format = 'json';
        break;
    }

    // Output
    if (options.output) {
      writeFileSync(options.output, output);
      if (!options.quiet) {
        console.error(chalk.green(`✅ Output saved to: ${options.output}`));
      }
    } else {
      console.log(output);
    }

    // Summary (if verbose)
    if (options.verbose && !options.quiet) {
      console.error('');
      console.error(chalk.dim('─'.repeat(50)));
      console.error(chalk.dim('Summary:'));
      console.error(chalk.dim(`  Mode: ${mode}`));
      console.error(chalk.dim(`  Format: ${options.format}`));
      console.error(chalk.dim(`  Files: ${data.files.length}`));
      console.error(
        chalk.dim(`  Comments: ${data.comments.general.length + Object.values(data.comments.byFile).flat().length}`)
      );
      console.error(chalk.dim(`  Reviews: ${data.reviews.summary.length}`));
    }
  } catch (error) {
    spinner?.fail(chalk.red('Failed to fetch PR data'));

    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));

      if (options.verbose) {
        console.error(chalk.dim(error.stack));
      }
    } else {
      console.error(chalk.red('An unknown error occurred'));
    }

    process.exit(1);
  }
}

// Parse and execute
program.parse();
