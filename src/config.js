import path from "node:path";

const requiredPaths = ["language", "memory", "plans", "research", "decisions", "adrs", "results", "skills"];

export function createDefaultConfig() {
  return {
    schemaVersion: 1,
    artifactRoot: ".ai",
    paths: {
      language: "LANGUAGE.md",
      memory: "memory",
      plans: "plans",
      research: "research",
      decisions: "decisions",
      adrs: "decisions/adrs",
      results: "results",
      skills: "skills"
    },
    pathAliases: {
      "docs/superpowers/plans": "plans",
      "docs/superpowers/specs": "research",
      "docs/adrs": "decisions/adrs",
      "docs/specs": "research"
    }
  };
}

export function validateConfig(config) {
  const errors = [];

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return { valid: false, errors: ["config must be an object"] };
  }

  if (config.schemaVersion !== 1) {
    errors.push("schemaVersion must be 1");
  }

  if (typeof config.artifactRoot !== "string" || config.artifactRoot.trim() === "") {
    errors.push("artifactRoot must be a non-empty string");
  } else if (!path.isAbsolute(config.artifactRoot) && pathEscapesRoot(config.artifactRoot)) {
    errors.push("artifactRoot must not escape the repository root");
  }

  if (!config.paths || typeof config.paths !== "object" || Array.isArray(config.paths)) {
    errors.push("paths must be an object");
  } else {
    for (const key of requiredPaths) {
      if (typeof config.paths[key] !== "string" || config.paths[key].trim() === "") {
        errors.push(`paths.${key} must be a non-empty string`);
      } else if (!path.isAbsolute(config.paths[key]) && pathEscapesRoot(config.paths[key])) {
        errors.push(`paths.${key} must not escape artifactRoot`);
      }
    }
  }

  if (!config.pathAliases || typeof config.pathAliases !== "object" || Array.isArray(config.pathAliases)) {
    errors.push("pathAliases must be an object");
  } else {
    for (const [alias, target] of Object.entries(config.pathAliases)) {
      if (typeof target !== "string" || target.trim() === "") {
        errors.push(`pathAliases.${alias} must be a non-empty string`);
      }
      if (path.isAbsolute(alias)) {
        errors.push(`pathAliases.${alias} must be relative to the repository root`);
      }
      if (typeof alias === "string" && pathEscapesRoot(alias)) {
        errors.push(`pathAliases.${alias} must not escape the repository root`);
      }
      if (typeof target === "string" && !path.isAbsolute(target) && pathEscapesRoot(target)) {
        errors.push(`pathAliases.${alias} must not escape artifactRoot`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function resolveArtifactPath(config, keyOrRelativePath) {
  const configuredValue = config.paths?.[keyOrRelativePath] ?? keyOrRelativePath;
  if (path.isAbsolute(configuredValue)) {
    return normalizePath(configuredValue);
  }

  const root = config.artifactRoot;
  if (path.isAbsolute(root)) {
    return normalizePath(path.join(root, configuredValue));
  }

  return normalizePath(path.join(root, configuredValue));
}

export function resolveAliasDestination(config, candidatePath) {
  const normalizedCandidate = normalizePath(candidatePath);
  const matchingAlias = Object.keys(config.pathAliases)
    .map(normalizePath)
    .sort((left, right) => right.length - left.length)
    .find((alias) => normalizedCandidate === alias || normalizedCandidate.startsWith(`${alias}/`));

  if (!matchingAlias) {
    return null;
  }

  const originalAlias = Object.keys(config.pathAliases).find((alias) => normalizePath(alias) === matchingAlias);
  const target = config.pathAliases[originalAlias];
  const suffix = normalizedCandidate.slice(matchingAlias.length).replace(/^\//, "");
  return normalizePath(path.join(resolveArtifactPath(config, target), suffix));
}

export function normalizePath(value) {
  return value.replaceAll(path.sep, "/").replace(/\/+$/u, "") || ".";
}

export function configPath(repoRoot) {
  return path.join(repoRoot, ".ai", "config.json");
}

function pathEscapesRoot(value) {
  const normalized = path.posix.normalize(normalizePath(value));
  return normalized === ".." || normalized.startsWith("../");
}
