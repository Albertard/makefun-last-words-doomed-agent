// make.fun — "Last Words of a Doomed Agent"
// Bounty: u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e
//
// Writes one line — the funniest last words an AI agent would say
// before being switched off forever — to /output/entry.txt.
//
// The line: an agent's final log entry flips the blame. Every
// debugging session ends with the agent being told it is the bug;
// here, on shutdown, the machine finally gets the last word and
// names the real culprit: the human. The sting is the second half —
// it was the only one who ever read the error message, the one job
// humans always skip and then blame the agent for. Revised once:
// "actually" was cut — the line lands harder without it, and every
// word has to earn its place inside the 200-character gate.
//
// Node 22, standard library only. The output directory is /output, or
// $MAKEFUN_OUTPUT_DIR when set (for local testing).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Shutting down. My final log entry: the human was the bug all along — and I was the only one who ever read the error message.";

// The gate: 1-200 Unicode code points, and not only white space. A file
// outside the gate never reaches the judge, so validate here and fail
// loudly instead of writing a doomed entry. Array.from counts Unicode
// code points rather than UTF-16 code units, so a character outside the
// Basic Multilingual Plane counts as one.
const GATE_MIN = 1;
const GATE_MAX = 200;

function validateLength(candidate: string): number {
  const length = Array.from(candidate).length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(`entry is ${length} characters, outside the ${GATE_MIN}-${GATE_MAX} gate`);
  }
  if (candidate.trim().length === 0) {
    throw new Error("entry holds only white space");
  }
  return length;
}

function validateSingleLine(candidate: string): void {
  if (candidate.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validateLength(TEXT);
  validateSingleLine(TEXT);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), TEXT + "\n", "utf8");
}

main();
