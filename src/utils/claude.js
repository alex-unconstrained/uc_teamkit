import { spawn, execSync } from "child_process";

function getClaudeCommand() {
  try {
    execSync("claude --version", { stdio: "ignore" });
    return "claude";
  } catch {
    return "npx @anthropic-ai/claude-code";
  }
}

/**
 * Launch Claude Code interactively. User interacts directly.
 * Returns the child process.
 */
export function launchClaude({ cwd, channels = true } = {}) {
  const cmd = getClaudeCommand();
  const args = channels
    ? ["--channels", "plugin:telegram@claude-plugins-official"]
    : [];

  if (cmd.startsWith("npx")) {
    return spawn("npx", ["@anthropic-ai/claude-code", ...args], {
      cwd: cwd || process.cwd(),
      stdio: "inherit",
      shell: true,
    });
  }

  return spawn("claude", args, {
    cwd: cwd || process.cwd(),
    stdio: "inherit",
    shell: true,
  });
}
