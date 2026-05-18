import assert from "node:assert/strict";
import test from "node:test";

import { applyManagedBlock, inspectManagedBlock, hasManagedBlock } from "../src/managed-blocks.js";

test("inserts a managed block without removing human content", () => {
  const existing = "# Project\n\nHuman rules stay here.\n";
  const next = applyManagedBlock(existing, "ai-harness", "Managed content");

  assert.match(next, /Human rules stay here/);
  assert.match(next, /BEGIN AI-HARNESS: ai-harness/);
  assert.match(next, /Managed content/);
});

test("updates an existing managed block idempotently", () => {
  const first = applyManagedBlock("# Project\n", "ai-harness", "One");
  const second = applyManagedBlock(first, "ai-harness", "Two");
  const third = applyManagedBlock(second, "ai-harness", "Two");

  assert.match(second, /Two/);
  assert.doesNotMatch(second, /One/);
  assert.equal(third, second);
  assert.equal((second.match(/BEGIN AI-HARNESS/g) ?? []).length, 1);
});

test("detects managed block presence", () => {
  const content = applyManagedBlock("", "agent-rules", "Rules");

  assert.equal(hasManagedBlock(content, "agent-rules"), true);
  assert.equal(hasManagedBlock(content, "missing"), false);
});

test("detects malformed managed block markers", () => {
  const content = "# Project\n\n<!-- BEGIN AI-HARNESS: agent-rules -->\nPartial body\n";

  assert.equal(inspectManagedBlock(content, "agent-rules").state, "malformed");
});

test("detects duplicate managed blocks", () => {
  const block = applyManagedBlock("# Project\n", "agent-rules", "Rules");
  const duplicated = `${block}\n${block}`;

  assert.equal(inspectManagedBlock(duplicated, "agent-rules").state, "duplicate");
});
