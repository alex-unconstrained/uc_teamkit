import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { banner, section, success, completionBanner } from "./utils/display.js";
import { runPersonalityInterview } from "./stages/personality.js";
import { runTelegramSetup } from "./stages/telegram.js";
import { runConnectionsSetup } from "./stages/connections.js";
import { runContextGathering, firstLaunch } from "./stages/context.js";

const onCancel = () => process.exit(0);

async function main() {
  const projectDir = process.cwd();
  const identityPath = path.join(projectDir, "my-identity.md");

  // Detect rerun: check if identity file exists AND doesn't contain template brackets
  const hasExisting = await fs.pathExists(identityPath);
  let isRerun = false;
  if (hasExisting) {
    const content = await fs.readFile(identityPath, "utf-8");
    isRerun = !content.includes("[FILL THIS IN]") && !content.includes("[Pick");
  }

  banner();

  // Rerun flow
  if (isRerun) {
    const { action } = await prompts({
      type: "select",
      name: "action",
      message: "You already have a personality configured. What would you like to do?",
      choices: [
        { title: "Reconfigure personality from scratch", value: "personality" },
        { title: "Keep personality, reconfigure connections", value: "connections" },
        { title: "Keep everything, just relaunch", value: "launch" },
      ],
    }, { onCancel });

    if (action === "launch") {
      await firstLaunch();
      return;
    }
    if (action === "connections") {
      await runConnectionsSetup();
      await firstLaunch();
      return;
    }
    // action === "personality" falls through to full flow
  }

  // Stage 1+2: Personality interview
  const personality = await runPersonalityInterview();

  // Preview and approve
  console.log("");
  success(`Generated personality for ${personality.identityAnswers.name} ${personality.identityAnswers.emoji}`);
  console.log("");

  const { approve } = await prompts({
    type: "confirm",
    name: "approve",
    message: "Look good? (You can always edit the files later)",
    initial: true,
  }, { onCancel });

  if (!approve) {
    console.log("Run npm run setup again to start over.");
    return;
  }

  // Write personality files
  await fs.writeFile(path.join(projectDir, "my-identity.md"), personality.identityMd);
  await fs.writeFile(path.join(projectDir, "my-soul.md"), personality.soulMd);
  success("Saved my-identity.md and my-soul.md");

  // Stage 3: Telegram
  const telegram = await runTelegramSetup();
  if (!telegram.success) {
    console.log("");
    info("Telegram isn't fully set up yet — you can finish later with: npm run setup");
    console.log("");
  }

  // Stage 4: Optional connections
  const { connections } = await runConnectionsSetup();

  // Stage 5: Context + files
  await runContextGathering(personality.identityAnswers);

  // Final banner
  completionBanner({
    name: personality.identityAnswers.name,
    emoji: personality.identityAnswers.emoji,
    connections,
  });

  // First launch
  await firstLaunch();
}

main().catch((err) => {
  console.error("\nSetup failed:", err.message);
  console.error("If you're stuck, reach out to Alex.");
  process.exit(1);
});
