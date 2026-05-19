import { collectDoctorFindings, applyFixes } from "./doctor.js";
import { runInit } from "./init.js";
import { exitCodeForFindings, formatFindings } from "./output.js";
import { gitStatus, isGitRepo } from "./repo.js";

export async function runCli(argv = process.argv.slice(2), options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const parsed = parseArgs(argv);

  if (parsed.error) {
    return { exitCode: 2, stdout: helpText(), stderr: `${parsed.error}\n` };
  }

  if (parsed.help) {
    return { exitCode: 0, stdout: helpText(), stderr: "" };
  }

  if (parsed.command === "init") {
    const validation = validateFlags(parsed.flags, ["dry-run", "force", "yes"]);
    if (validation) {
      return { exitCode: 2, stdout: helpText(), stderr: `${validation}\n` };
    }
    return runInit({ cwd, dryRun: parsed.flags.has("dry-run"), force: parsed.flags.has("force") || parsed.flags.has("yes") });
  }

  if (parsed.command === "doctor") {
    const validation = validateFlags(parsed.flags, ["fix", "force"]);
    if (validation) {
      return { exitCode: 2, stdout: helpText(), stderr: `${validation}\n` };
    }

    if (!(await isGitRepo(cwd))) {
      return { exitCode: 2, stdout: "", stderr: "Refusing to inspect: current directory is not a git repository.\n" };
    }

    const findings = await collectDoctorFindings(cwd);
    if (parsed.flags.has("fix")) {
      const manual = findings.filter((finding) => !finding.fixable);
      if (manual.length > 0) {
        return { exitCode: 2, stdout: formatFindings(findings), stderr: "" };
      }
      const fixable = findings.filter((finding) => finding.fixable);
      if (!parsed.flags.has("force") && fixable.length > 0) {
        const status = await gitStatus(cwd);
        if (status) {
          return {
            exitCode: 2,
            stdout: "",
            stderr: "Refusing to fix with a dirty git worktree. Commit/stash changes or pass --force.\n"
          };
        }
      }
      await applyFixes(findings);
      return {
        exitCode: 0,
        stdout: `AI Harness doctor --fix\n${formatFindings(findings, { emptyMessage: "No issues found.", fixableHeading: "Applied fixes:" })}`,
        stderr: ""
      };
    }

    return {
      exitCode: exitCodeForFindings(findings),
      stdout: `AI Harness doctor\n${formatFindings(findings)}`,
      stderr: ""
    };
  }

  return { exitCode: 2, stdout: helpText(), stderr: `Unknown command: ${parsed.command ?? "(none)"}\n` };
}

export async function main() {
  const result = await runCli();
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  process.exitCode = result.exitCode;
}

function parseArgs(argv) {
  const flags = new Set();
  let command = null;
  let help = false;
  let error = null;

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (arg.startsWith("--")) {
      flags.add(arg.slice(2));
    } else if (!command) {
      command = arg;
    } else {
      error = `Unexpected argument: ${arg}`;
    }
  }

  return { command, flags, help, error };
}

function validateFlags(flags, allowedFlags) {
  const allowed = new Set(allowedFlags);
  for (const flag of flags) {
    if (!allowed.has(flag)) {
      return `Unknown option: --${flag}`;
    }
  }
  return null;
}

function helpText() {
  return `AI Harness CLI

Usage:
  ai-harness init [--dry-run] [--force]
  ai-harness doctor [--fix] [--force]

Commands:
  init          Install or refresh the config-driven AI harness
  doctor        Inspect harness drift; reports fixable and manual issues
  doctor --fix  Apply safe deterministic repairs reported by doctor

`;
}
