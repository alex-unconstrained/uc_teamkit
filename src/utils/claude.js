import { spawn } from "child_process";

/**
 * Launch Claude Code interactively. User interacts directly.
 * Returns the child process.
 */
export function launchClaude({ cwd, channels = true } = {}) {
  const args = channels
    ? ["--channels", "plugin:telegram@claude-plugins-official"]
    : [];
  return spawn("claude", args, {
    cwd: cwd || process.cwd(),
    stdio: "inherit",
    shell: true,
  });
}
