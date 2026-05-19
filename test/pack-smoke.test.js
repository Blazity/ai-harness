import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test("packed CLI initializes and doctors a temp repo", async () => {
  const workspace = await mkdtemp(path.join(tmpdir(), "ai-harness-pack-"));
  const repo = path.join(workspace, "repo");
  let tarball = null;
  try {
    const { stdout } = await execFileAsync("npm", ["pack", "--json"], { cwd: process.cwd() });
    const [{ filename }] = JSON.parse(stdout);
    tarball = path.join(process.cwd(), filename);

    await execFileAsync("git", ["init", repo]);
    const init = await execFileAsync("npm", ["exec", "--yes", "--package", tarball, "--", "ai-harness", "init"], {
      cwd: repo
    });
    const doctor = await execFileAsync("npm", ["exec", "--yes", "--package", tarball, "--", "ai-harness", "doctor"], {
      cwd: repo
    });

    assert.match(init.stdout, /AI Harness init/);
    assert.match(doctor.stdout, /No issues found/);
  } finally {
    if (tarball) {
      await rm(tarball, { force: true });
    }
    await rm(workspace, { recursive: true, force: true });
  }
});

test("package publishes scoped package publicly by default", async () => {
  const packageJson = JSON.parse(await readFile(path.join(process.cwd(), "package.json"), "utf8"));

  assert.equal(packageJson.name, "@blazity-atlas/ai-harness");
  assert.equal(packageJson.publishConfig?.access, "public");
});
