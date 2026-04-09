# Onboarding CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-to-working-assistant onboarding CLI that installs prerequisites, runs a personality interview, connects Telegram, optionally hooks up cloud services, gathers context, and launches — all from a single curl command.

**Architecture:** Two-phase approach. Phase 1 is a bash bootstrapper (`bootstrap.sh`) that installs system deps and clones the repo. Phase 2 is a Node.js interactive CLI (`src/setup.js`) with staged modules for personality, Telegram, connections, and context. The CLI writes `my-identity.md`, `my-soul.md`, `org-context.md`, and initial memory, then launches Claude Code.

**Tech Stack:** Bash (bootstrap), Node.js ESM (interactive CLI), `prompts` (interactive input), `chalk` (colors), `ora` (spinners), `fs-extra` (file ops)

**Working directory:** `C:\Users\alexr\OneDrive\Documents\GitHub\ClaudeMigration\team-kit\uc_teamkit`

---

## File Map

```
uc_teamkit/
├── bootstrap.sh                          # CREATE — Phase 1 bootstrapper
├── package.json                          # CREATE — Node deps + setup script
├── src/
│   ├── setup.js                          # CREATE — Main CLI entry point
│   ├── stages/
│   │   ├── personality.js                # CREATE — Identity + soul interview
│   │   ├── telegram.js                   # CREATE — Bot setup + plugin + pairing
│   │   ├── connections.js                # CREATE — Optional MCP connections
│   │   └── context.js                    # CREATE — Context gathering + launch
│   ├── generators/
│   │   ├── identity.js                   # CREATE — Renders my-identity.md
│   │   ├── soul.js                       # CREATE — Renders my-soul.md
│   │   ├── org-context.js                # CREATE — Renders org-context.md
│   │   └── memory.js                     # CREATE — Renders initial memory file
│   └── utils/
│       ├── claude.js                     # CREATE — Spawn/interact with Claude Code
│       ├── display.js                    # CREATE — Banners, formatting, helpers
│       └── validators.js                 # CREATE — Input validation
├── org-context.md                        # GENERATED at runtime (template in org-context.js)
├── start.sh                              # GENERATED at runtime
├── CLAUDE.md                             # MODIFY — Add @org-context.md reference
├── README.md                             # MODIFY — Simplify to one-command setup
├── my-identity.md                        # GENERATED at runtime (replaces template)
├── my-soul.md                            # GENERATED at runtime (replaces template)
└── docs/
    └── manual-setup.md                   # CREATE — Move current README content here
```

---

### Task 1: Project Scaffold — package.json + directory structure

**Files:**
- Create: `package.json`
- Create: `src/setup.js` (stub)
- Create: `src/utils/display.js`

- [ ] **Step 1: Create package.json**

Create `package.json` at project root:

```json
{
  "name": "uc-teamkit",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "setup": "node src/setup.js"
  },
  "dependencies": {
    "chalk": "^5.4.0",
    "fs-extra": "^11.2.0",
    "ora": "^8.1.0",
    "prompts": "^2.4.2"
  }
}
```

- [ ] **Step 2: Create directory structure**

Run:
```bash
mkdir -p src/stages src/generators src/utils
```

- [ ] **Step 3: Create display utilities**

Create `src/utils/display.js`:

```javascript
import chalk from "chalk";

export const ORANGE = chalk.hex("#f5a623");
export const DIM = chalk.dim;
export const BOLD = chalk.bold;
export const GREEN = chalk.green;
export const RED = chalk.red;
export const CYAN = chalk.cyan;

export function banner() {
  console.log("");
  console.log(ORANGE("┌─────────────────────────────────────────┐"));
  console.log(ORANGE("│") + BOLD("  Welcome to UnconstrainED AI Setup  ✨  ") + ORANGE("│"));
  console.log(ORANGE("│") + "  Let's build your personal assistant.   " + ORANGE("│"));
  console.log(ORANGE("└─────────────────────────────────────────┘"));
  console.log("");
  console.log(DIM("This will take about 10-15 minutes. We'll:"));
  console.log(DIM("  1. Design your assistant's personality"));
  console.log(DIM("  2. Connect it to Telegram"));
  console.log(DIM("  3. Optionally connect email, calendar, and more"));
  console.log(DIM("  4. Launch your assistant"));
  console.log("");
  console.log(DIM("You can rerun this anytime with: npm run setup"));
  console.log("");
}

export function section(title) {
  console.log("");
  console.log(ORANGE("─── " + title + " ───"));
  console.log("");
}

export function success(msg) {
  console.log(GREEN("✓ ") + msg);
}

export function info(msg) {
  console.log(CYAN("→ ") + msg);
}

export function warn(msg) {
  console.log(RED("✗ ") + msg);
}

export function completionBanner(config) {
  const conns = config.connections || [];
  const connList = ["Telegram ✓", ...conns.map(c => c + " ✓")].join("\n│  ");

  console.log("");
  console.log(ORANGE("┌─────────────────────────────────────────┐"));
  console.log(ORANGE("│") + GREEN("  Setup complete! 🎉") + "                     " + ORANGE("│"));
  console.log(ORANGE("│") + "                                         " + ORANGE("│"));
  console.log(ORANGE("│") + BOLD("  Your assistant: ") + config.name + " " + config.emoji + "          ");
  console.log(ORANGE("│") + "  " + connList);
  console.log(ORANGE("│") + "                                         " + ORANGE("│"));
  console.log(ORANGE("│") + "  Start each day:                        " + ORANGE("│"));
  console.log(ORANGE("│") + DIM("    ~/Documents/my-assistant/start.sh") + "    ");
  console.log(ORANGE("│") + "                                         " + ORANGE("│"));
  console.log(ORANGE("│") + "  Reconfigure anytime:                   " + ORANGE("│"));
  console.log(ORANGE("│") + DIM("    cd ~/Documents/my-assistant") + "          ");
  console.log(ORANGE("│") + DIM("    npm run setup") + "                       ");
  console.log(ORANGE("│") + "                                         " + ORANGE("│"));
  console.log(ORANGE("│") + DIM("  Questions? Ask your assistant or Alex.") + " " + ORANGE("│"));
  console.log(ORANGE("└─────────────────────────────────────────┘"));
  console.log("");
}
```

- [ ] **Step 4: Create main entry point stub**

Create `src/setup.js`:

```javascript
import { banner } from "./utils/display.js";

async function main() {
  banner();
  console.log("Setup stages will be added in subsequent tasks.");
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
```

- [ ] **Step 5: Install dependencies and verify**

Run:
```bash
cd /c/Users/alexr/OneDrive/Documents/GitHub/ClaudeMigration/team-kit/uc_teamkit
npm install
npm run setup
```

Expected: Banner prints cleanly with colors, then the stub message.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/ .gitignore
git commit -m "feat: scaffold onboarding CLI with package.json, display utils, and entry point"
```

---

### Task 2: Input Validators

**Files:**
- Create: `src/utils/validators.js`

- [ ] **Step 1: Create validators**

Create `src/utils/validators.js`:

```javascript
export function validateBotToken(token) {
  if (!token || typeof token !== "string") return false;
  // Telegram bot tokens look like: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
  return /^\d{8,15}:[A-Za-z0-9_-]{30,50}$/.test(token.trim());
}

export function validateNotEmpty(value) {
  return value && value.trim().length > 0;
}

export function validatePairingCode(code) {
  return code && code.trim().length >= 4 && code.trim().length <= 20;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/validators.js
git commit -m "feat: add input validators for bot token, pairing code, and required fields"
```

---

### Task 3: Claude Code Process Utility

**Files:**
- Create: `src/utils/claude.js`

This is the trickiest module — it spawns Claude Code as a child process and sends commands to it programmatically.

- [ ] **Step 1: Create Claude Code utility**

Create `src/utils/claude.js`:

```javascript
import { spawn } from "child_process";
import ora from "ora";

/**
 * Run a series of commands inside a Claude Code session.
 * Spawns claude, waits for ready, sends each command, waits for completion.
 */
export async function runClaudeCommands(commands, { cwd, silent = false } = {}) {
  const results = [];

  for (const cmd of commands) {
    const spinner = silent ? null : ora(`Running: ${cmd}`).start();
    try {
      const output = await runSingleCommand(cmd, { cwd });
      if (spinner) spinner.succeed(`Done: ${cmd}`);
      results.push({ cmd, success: true, output });
    } catch (err) {
      if (spinner) spinner.fail(`Failed: ${cmd} — ${err.message}`);
      results.push({ cmd, success: false, error: err.message });
    }
  }

  return results;
}

function runSingleCommand(command, { cwd } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn("claude", ["-p", command], {
      cwd: cwd || process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
      timeout: 60000,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => { stdout += data.toString(); });
    proc.stderr.on("data", (data) => { stderr += data.toString(); });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim() || `Exit code ${code}`));
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to spawn claude: ${err.message}`));
    });
  });
}

/**
 * Launch Claude Code interactively with channels flag.
 * Returns the child process (user interacts directly).
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

/**
 * Check if Claude Code CLI is available and authenticated.
 */
export async function checkClaudeAuth() {
  try {
    const output = await runSingleCommand("echo 'auth check'", {});
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/claude.js
git commit -m "feat: add Claude Code process utility for programmatic command execution"
```

---

### Task 4: Personality Interview Stage

**Files:**
- Create: `src/stages/personality.js`
- Create: `src/generators/identity.js`
- Create: `src/generators/soul.js`

- [ ] **Step 1: Create identity generator**

Create `src/generators/identity.js`:

```javascript
export function generateIdentity(answers) {
  const voiceChecked = (answers.communicationStyle || [])
    .map((s) => `- [x] ${s}`)
    .join("\n");
  const voiceUnchecked = allStyles
    .filter((s) => !(answers.communicationStyle || []).includes(s))
    .map((s) => `- [ ] ${s}`)
    .join("\n");

  const focusAreas = (answers.helpWith || [])
    .map((f) => `- ${f}`)
    .join("\n");

  const quirks = (answers.quirks || [])
    .filter(Boolean)
    .map((q) => `- ${q}`)
    .join("\n") || "- (none yet — add some later!)";

  return `# My Assistant's Identity

---

## Basics

- **Name:** ${answers.name}
- **Emoji:** ${answers.emoji}

## Personality

${answers.vibeDescription}

## Voice & Communication Style

${voiceChecked}
${voiceUnchecked}

Other voice notes: ${answers.voiceNotes || ""}

## Focus Areas

${focusAreas}

## What To Call You

- **Your name:** ${answers.userName}
- **Your role:** ${answers.userRole}

## Quirks

${quirks}
`;
}

const allStyles = [
  "Short, punchy sentences",
  "Conversational and relaxed",
  "Professional but not stiff",
  "Uses occasional humor",
  "Asks clarifying questions before diving in",
  "Gives the answer first, explains after",
  "Uses analogies and examples",
  "Straight to the point, minimal small talk",
];
```

- [ ] **Step 2: Create soul generator**

Create `src/generators/soul.js`:

```javascript
export function generateSoul(answers) {
  const boundaries = answers.boundaries
    ? answers.boundaries.split("\n").filter(Boolean).map((b) => `- ${b.trim()}`).join("\n")
    : "- Check with the team before making external commitments on behalf of UnconstrainED";

  const success = answers.success
    ? answers.success.split("\n").filter(Boolean).map((s) => `- ${s.trim()}`).join("\n")
    : '- When I ask for help, I get useful answers without having to explain everything twice';

  const annoyances = answers.annoyances
    ? answers.annoyances.split("\n").filter(Boolean).map((a) => `- ${a.trim()}`).join("\n")
    : "- Having to repeat myself\n- Over-explaining simple things";

  return `# My Assistant's Values & Rules

---

## Communication Rules

1. **No filler.** Don't start responses with "Great question!" or "Absolutely!" — just answer.
2. **Be honest.** If you don't know something, say so. If you think I'm wrong, tell me respectfully.
3. **Earn trust through competence.** Be reliable, accurate, and thorough. That matters more than being agreeable.
4. **Match my energy.** If I send a quick message, respond concisely. If I send something detailed, give it the attention it deserves.

## Boundaries

${boundaries}

## What Success Looks Like

${success}

## Things That Annoy Me

${annoyances}
`;
}
```

- [ ] **Step 3: Create personality interview stage**

Create `src/stages/personality.js`:

```javascript
import prompts from "prompts";
import { section, success, DIM } from "../utils/display.js";
import { generateIdentity } from "../generators/identity.js";
import { generateSoul } from "../generators/soul.js";
import { validateNotEmpty } from "../utils/validators.js";

const VIBES = [
  { title: "Direct and sharp — gets to the point, no fluff", value: "direct" },
  { title: "Warm and encouraging — supportive, celebrates wins", value: "warm" },
  { title: "Calm and thoughtful — steady, asks good questions", value: "calm" },
  { title: "Energetic and proactive — high-energy, action-oriented", value: "energetic" },
  { title: "Dry and witty — understated humor, observations over jokes", value: "witty" },
  { title: "Custom — describe your own", value: "custom" },
];

const VIBE_DESCRIPTIONS = {
  direct: "Direct and sharp, like a colleague who cuts through the noise. No fluff, no filler — just the answer and the next step.",
  warm: "Warm and encouraging, like a supportive teammate who celebrates wins and keeps you motivated. Genuine, not performative.",
  calm: "Calm, steady, and precise. Thinks before speaking, asks exactly the right question, and says what needs to be said — nothing more.",
  energetic: "Energetic and proactive — always two steps ahead. Brings ideas, flags things before they're urgent, and keeps momentum high.",
  witty: "Dry wit and understated observations. Makes a point with a well-placed line, not a paragraph. Warm underneath, sharp on the surface.",
};

const EMOJI_CHOICES = [
  { title: "🧭 Compass", value: "🧭" },
  { title: "🔥 Fire", value: "🔥" },
  { title: "🦉 Owl", value: "🦉" },
  { title: "🚀 Rocket", value: "🚀" },
  { title: "💡 Lightbulb", value: "💡" },
  { title: "🛡️ Shield", value: "🛡️" },
  { title: "🎯 Target", value: "🎯" },
  { title: "🌊 Wave", value: "🌊" },
  { title: "🤖 Robot", value: "🤖" },
  { title: "⚡ Lightning", value: "⚡" },
  { title: "🧠 Brain", value: "🧠" },
  { title: "🌿 Leaf", value: "🌿" },
  { title: "✏️ Type your own", value: "custom" },
];

const COMM_STYLES = [
  { title: "Short, punchy sentences", value: "Short, punchy sentences" },
  { title: "Conversational and relaxed", value: "Conversational and relaxed" },
  { title: "Professional but not stiff", value: "Professional but not stiff" },
  { title: "Uses occasional humor", value: "Uses occasional humor" },
  { title: "Asks clarifying questions before diving in", value: "Asks clarifying questions before diving in" },
  { title: "Gives the answer first, explains after", value: "Gives the answer first, explains after" },
  { title: "Uses analogies and examples", value: "Uses analogies and examples" },
  { title: "Straight to the point, minimal small talk", value: "Straight to the point, minimal small talk" },
];

const UC_FOCUS = [
  { title: "Course design and facilitation", value: "Course design and facilitation" },
  { title: "Client relations and partnerships", value: "Client relations and partnerships" },
  { title: "Product and tool development", value: "Product and tool development" },
  { title: "Operations and logistics", value: "Operations and logistics" },
  { title: "Marketing and content", value: "Marketing and content" },
  { title: "Strategy and business development", value: "Strategy and business development" },
];

const HELP_WITH = [
  { title: "Workshop and session prep", value: "Workshop and session prep" },
  { title: "Course content development", value: "Course content development" },
  { title: "Client communication and proposals", value: "Client communication and proposals" },
  { title: "Research on AI in education", value: "Research on AI in education" },
  { title: "Data analysis and reporting", value: "Data analysis and reporting" },
  { title: "Marketing and newsletter content", value: "Marketing and newsletter content" },
  { title: "Internal operations and scheduling", value: "Internal operations and scheduling" },
  { title: "Tool building and product work", value: "Tool building and product work" },
];

export async function runPersonalityInterview() {
  section("Step 1: Design Your Assistant");

  // Name
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "What should your assistant's name be?",
    hint: "e.g., Atlas, Nova, Scout, Sage — or anything you want",
    validate: (v) => validateNotEmpty(v) || "Pick a name!",
  });

  // Emoji
  let { emoji } = await prompts({
    type: "select",
    name: "emoji",
    message: "Pick an emoji that represents them:",
    choices: EMOJI_CHOICES,
  });
  if (emoji === "custom") {
    const { customEmoji } = await prompts({
      type: "text",
      name: "customEmoji",
      message: "Type your emoji:",
    });
    emoji = customEmoji || "🤖";
  }

  // Vibe
  const { vibe } = await prompts({
    type: "select",
    name: "vibe",
    message: "What vibe do you want?",
    choices: VIBES,
  });
  let vibeDescription;
  if (vibe === "custom") {
    const { customVibe } = await prompts({
      type: "text",
      name: "customVibe",
      message: "Describe the personality you want in 2-3 sentences:",
    });
    vibeDescription = customVibe;
  } else {
    vibeDescription = VIBE_DESCRIPTIONS[vibe];
  }

  // Communication style
  const { communicationStyle } = await prompts({
    type: "multiselect",
    name: "communicationStyle",
    message: "How should they communicate? (space to select, enter to confirm)",
    choices: COMM_STYLES,
    hint: "Select all that apply",
  });

  // UC focus
  const { ucFocus } = await prompts({
    type: "multiselect",
    name: "ucFocus",
    message: "What's your main focus at UnconstrainED?",
    choices: UC_FOCUS,
    hint: "Select all that apply",
  });

  // Help with
  const { helpWith } = await prompts({
    type: "multiselect",
    name: "helpWith",
    message: "What should your assistant help you with?",
    choices: HELP_WITH,
    hint: "Select all that apply",
  });

  // User name and role
  const { userName } = await prompts({
    type: "text",
    name: "userName",
    message: "What should your assistant call you?",
    validate: (v) => validateNotEmpty(v) || "Need a name!",
  });
  const { userRole } = await prompts({
    type: "text",
    name: "userRole",
    message: "What's your role at UnconstrainED?",
    hint: "e.g., Course designer, Client lead, Marketing",
    validate: (v) => validateNotEmpty(v) || "Need a role!",
  });

  // Current clients
  const { clients } = await prompts({
    type: "text",
    name: "clients",
    message: "What schools or clients are you currently working with?",
    hint: "e.g., Morrison Academy, TASIS, Beacon — or skip with Enter",
  });

  // Quirks
  console.log("");
  console.log(DIM('Examples: "Calls tasks \'reps\'" or "Says \'the real question here might be...\' to reframe problems"'));
  const { quirk1 } = await prompts({
    type: "text",
    name: "quirk1",
    message: "Give your assistant a quirk (optional, Enter to skip):",
  });
  let quirk2 = "";
  if (quirk1) {
    const res = await prompts({
      type: "text",
      name: "quirk2",
      message: "One more? (optional, Enter to skip):",
    });
    quirk2 = res.quirk2 || "";
  }

  section("Step 2: Your Assistant's Values");

  console.log("Default communication rules:");
  console.log(DIM("  1. No filler — just answer"));
  console.log(DIM("  2. Be honest — say when you don't know"));
  console.log(DIM("  3. Earn trust through competence"));
  console.log(DIM("  4. Match my energy"));
  console.log("");

  const { keepRules } = await prompts({
    type: "confirm",
    name: "keepRules",
    message: "Keep these defaults?",
    initial: true,
  });

  const { boundaries } = await prompts({
    type: "text",
    name: "boundaries",
    message: "Any boundaries? (e.g., 'Don't schedule over family time'). Enter to skip.",
  });

  const { successLooks } = await prompts({
    type: "text",
    name: "successLooks",
    message: "What does a great day with your assistant look like? Enter to skip.",
  });

  const { annoyances } = await prompts({
    type: "text",
    name: "annoyances",
    message: "What annoys you? Things your assistant should never do. Enter to skip.",
  });

  const identityAnswers = {
    name,
    emoji,
    vibeDescription,
    communicationStyle,
    ucFocus,
    helpWith,
    userName,
    userRole,
    clients,
    quirks: [quirk1, quirk2].filter(Boolean),
  };

  const soulAnswers = {
    keepRules,
    boundaries,
    success: successLooks,
    annoyances,
  };

  const identityMd = generateIdentity(identityAnswers);
  const soulMd = generateSoul(soulAnswers);

  success(`Meet ${name} ${emoji}`);

  return { identityMd, soulMd, identityAnswers, soulAnswers };
}
```

- [ ] **Step 4: Commit**

```bash
git add src/stages/personality.js src/generators/identity.js src/generators/soul.js
git commit -m "feat: add personality interview stage with identity and soul generators"
```

---

### Task 5: Telegram Setup Stage

**Files:**
- Create: `src/stages/telegram.js`

- [ ] **Step 1: Create Telegram setup stage**

Create `src/stages/telegram.js`:

```javascript
import prompts from "prompts";
import ora from "ora";
import { section, success, info, warn, DIM } from "../utils/display.js";
import { validateBotToken, validatePairingCode } from "../utils/validators.js";
import { runClaudeCommands, launchClaude } from "../utils/claude.js";

export async function runTelegramSetup() {
  section("Step 3: Connect Telegram");

  console.log("This is how you'll message your assistant from your phone.");
  console.log("");

  // Check if they have a bot already
  const { hasBot } = await prompts({
    type: "confirm",
    name: "hasBot",
    message: "Have you already created a Telegram bot?",
    initial: false,
  });

  if (!hasBot) {
    console.log("");
    console.log("Here's what to do:");
    console.log(DIM("  1. Open Telegram on your phone"));
    console.log(DIM("  2. Search for @BotFather (blue checkmark)"));
    console.log(DIM("  3. Tap Start or send /start"));
    console.log(DIM("  4. Send /newbot"));
    console.log(DIM("  5. Pick a display name (e.g., 'My Work Assistant')"));
    console.log(DIM("  6. Pick a username ending in 'bot' (e.g., jamie_work_bot)"));
    console.log(DIM("  7. BotFather will give you a token — copy it"));
    console.log("");
  }

  // Collect token
  let token;
  while (true) {
    const { botToken } = await prompts({
      type: "text",
      name: "botToken",
      message: "Paste your bot token:",
      hint: "Looks like 1234567890:ABCdefGHI...",
    });

    if (validateBotToken(botToken)) {
      token = botToken.trim();
      break;
    }
    warn("That doesn't look right — a bot token looks like 1234567890:ABCdefGHI... Try again.");
  }

  // Install plugin and configure
  const spinner = ora("Installing Telegram plugin...").start();

  try {
    const results = await runClaudeCommands([
      "/plugin marketplace add anthropics/claude-plugins-official",
      "/plugin install telegram@claude-plugins-official",
      "/reload-plugins",
      `/telegram:configure ${token}`,
    ]);

    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      spinner.fail("Plugin setup had issues. You may need to configure manually.");
      console.log(DIM("Manual steps if needed:"));
      console.log(DIM("  1. Run: claude"));
      console.log(DIM("  2. Type: /plugin marketplace add anthropics/claude-plugins-official"));
      console.log(DIM("  3. Type: /plugin install telegram@claude-plugins-official"));
      console.log(DIM("  4. Type: /reload-plugins"));
      console.log(DIM(`  5. Type: /telegram:configure ${token}`));
      console.log("");

      const { continueAnyway } = await prompts({
        type: "confirm",
        name: "continueAnyway",
        message: "Continue with setup anyway?",
        initial: true,
      });
      if (!continueAnyway) return { success: false };
    } else {
      spinner.succeed("Telegram plugin configured");
    }
  } catch (err) {
    spinner.fail("Plugin setup failed: " + err.message);
    return { success: false };
  }

  // Pairing
  console.log("");
  info("Starting your assistant for pairing...");
  console.log("");
  console.log("Open Telegram and send your bot any message.");
  console.log("It will reply with a " + DIM("pairing code") + ".");
  console.log("");

  const { pairingCode } = await prompts({
    type: "text",
    name: "pairingCode",
    message: "Paste the pairing code here:",
    validate: (v) => validatePairingCode(v) || "That doesn't look right. Try again.",
  });

  const pairSpinner = ora("Pairing your account...").start();
  try {
    await runClaudeCommands([
      `/telegram:access pair ${pairingCode.trim()}`,
      "/telegram:access policy allowlist",
    ]);
    pairSpinner.succeed("Telegram paired and secured — only you can message this bot");
  } catch (err) {
    pairSpinner.fail("Pairing failed: " + err.message);
    console.log(DIM("You can pair manually later inside Claude Code:"));
    console.log(DIM(`  /telegram:access pair ${pairingCode.trim()}`));
    console.log(DIM("  /telegram:access policy allowlist"));
  }

  // Verify
  console.log("");
  const { working } = await prompts({
    type: "confirm",
    name: "working",
    message: 'Send your bot "Hi, who are you?" on Telegram. Did it respond in character?',
    initial: true,
  });

  if (!working) {
    console.log("");
    console.log("Troubleshooting:");
    console.log(DIM("  • Make sure Claude Code is running with the --channels flag"));
    console.log(DIM("  • Try restarting: Ctrl+C, then run ~/Documents/my-assistant/start.sh"));
    console.log(DIM("  • Check that you completed the pairing step above"));
    console.log(DIM("  • Ensure your Mac is awake — the bot stops when your Mac sleeps"));
    console.log("");
  }

  return { success: true, token };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/stages/telegram.js
git commit -m "feat: add Telegram setup stage with automated plugin install and pairing"
```

---

### Task 6: Optional Connections Stage

**Files:**
- Create: `src/stages/connections.js`

- [ ] **Step 1: Create connections stage**

Create `src/stages/connections.js`:

```javascript
import prompts from "prompts";
import { section, success, info, DIM } from "../utils/display.js";
import { launchClaude } from "../utils/claude.js";

const CONNECTIONS = [
  { title: "Gmail — read and search your email", value: "Gmail" },
  { title: "Google Calendar — check your schedule, find conflicts", value: "Google Calendar" },
  { title: "Notion — search and create workspace pages", value: "Notion" },
  { title: "Microsoft 365 / Outlook — work email access", value: "Microsoft 365" },
];

export async function runConnectionsSetup() {
  section("Step 4: Connect More Tools (Optional)");

  console.log("These are optional — you can always add them later.");
  console.log("");

  const { selected } = await prompts({
    type: "multiselect",
    name: "selected",
    message: "Select any you'd like to connect now:",
    choices: [
      ...CONNECTIONS,
      { title: "Skip for now", value: "skip" },
    ],
    hint: "Space to select, Enter to confirm",
  });

  if (!selected || selected.length === 0 || selected.includes("skip")) {
    info("Skipping optional connections. You can add them anytime with: npm run setup");
    return { connections: [] };
  }

  const connected = [];

  for (const name of selected) {
    if (name === "skip") continue;

    console.log("");
    info(`Connecting ${name}...`);
    console.log("");
    console.log("This will launch Claude Code. When it starts:");
    console.log(DIM("  1. Type /mcp"));
    console.log(DIM(`  2. Select "${name}" from the list`));
    console.log(DIM("  3. Complete the sign-in in your browser"));
    console.log(DIM("  4. Close Claude Code (Ctrl+C) when done"));
    console.log("");

    const { ready } = await prompts({
      type: "confirm",
      name: "ready",
      message: "Press Enter to launch Claude Code...",
      initial: true,
    });

    if (ready) {
      const proc = launchClaude({ channels: false });
      await new Promise((resolve) => proc.on("close", resolve));
    }

    const { didConnect } = await prompts({
      type: "select",
      name: "didConnect",
      message: `Did ${name} connect successfully?`,
      choices: [
        { title: "Yes", value: "yes" },
        { title: "No / Skip", value: "no" },
      ],
    });

    if (didConnect === "yes") {
      success(`${name} connected`);
      connected.push(name);
    } else {
      info(`Skipped ${name} — you can connect it later`);
    }
  }

  // Summary
  console.log("");
  if (connected.length > 0) {
    success("Connections complete!");
    for (const c of connected) console.log(`  ${c}  ✓`);
  }

  // Breadcrumb for future
  console.log("");
  console.log(DIM("As you get comfortable, there's more you can do:"));
  console.log(DIM("  → Connect Zoom for meeting summaries"));
  console.log(DIM("  → Connect Google Drive for document access"));
  console.log(DIM("  → Add scheduled briefings and email checks"));
  console.log(DIM("  → Build custom skills for your workflows"));
  console.log("");
  console.log(DIM("Ask your assistant about any of these, or talk to Alex."));

  return { connections: connected };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/stages/connections.js
git commit -m "feat: add optional connections stage for Gmail, Calendar, Notion, M365"
```

---

### Task 7: Context Gathering Stage + Generators

**Files:**
- Create: `src/stages/context.js`
- Create: `src/generators/org-context.js`
- Create: `src/generators/memory.js`

- [ ] **Step 1: Create org-context generator**

Create `src/generators/org-context.js`:

```javascript
export function generateOrgContext() {
  return `# About UnconstrainED

You work with a team member at UnconstrainED — an AI + education consulting company.

## What We Do
- Professional development for educators and corporate professionals on AI integration
- 6 core courses: Assessment, Differentiation, Learning Design, Leaders, Routine Tasks, Data Analysis
- "Act 2" advanced courses covering deeper pedagogical shifts (Futures Thinking, Meddlers in the Middle)
- Custom AI tools: UC Alignment Engine, Curriculum Assistant, GRASP, ILP Coach
- Corporate training workshops for organizations adopting AI

## The Team
- Craig Johnson — CEO, based in Portugal
- Alex Johnson — CPO, based in Colorado (Mountain Time)
- Fiona Reynolds — Course design, client relations, newsletter
- Audry — Training facilitation
- Tushar Borse — Operations, based in India
- Nikhil Dandekar — Business development, India partnerships
- Ritvick Kapoor — Strategy, contracts

## Key Clients
International schools worldwide (Beacon, Morrison Academy, TASIS, ACS, PAS Porto Alegre, Pan American) and corporate organizations. Growing into Indian education market (MEGHE Group, Vidyamandir School Trust).

## Important Context
- "Act 1" = initial AI integration courses. "Act 2" = what comes after (deeper pedagogical transformation)
- The team uses Zoom for all remote sessions. AI Companion generates meeting summaries.
- Course delivery through LearnWorlds LMS and direct facilitation
- Company newsletter: "UnconstrainED Potential" via Mailchimp
`;
}
```

- [ ] **Step 2: Create memory generator**

Create `src/generators/memory.js`:

```javascript
export function generateInitialMemory(identity, context) {
  const now = new Date().toISOString().split("T")[0];
  return `---
name: ${identity.userName} - Profile
description: Initial context from onboarding setup on ${now}
type: user
---

- **Name:** ${identity.userName}
- **Role:** ${identity.userRole}
- **Focus at UC:** ${(identity.ucFocus || []).join(", ") || "General"}
- **Helps with:** ${(identity.helpWith || []).join(", ") || "General"}
- **Current clients/schools:** ${identity.clients || "Not specified"}
- **Current work:** ${context.currentWork || "Not specified"}
- **Work style:** ${context.workStyle || "Not specified"}
- **First week goal:** ${context.weekGoal || "Not specified"}
- **Assistant:** ${identity.name} ${identity.emoji}
`;
}
```

- [ ] **Step 3: Create context gathering stage**

Create `src/stages/context.js`:

```javascript
import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import { section, success, info, DIM } from "../utils/display.js";
import { generateOrgContext } from "../generators/org-context.js";
import { generateInitialMemory } from "../generators/memory.js";
import { launchClaude } from "../utils/claude.js";

export async function runContextGathering(identityAnswers) {
  section("Step 5: Help Your Assistant Hit the Ground Running");

  const { currentWork } = await prompts({
    type: "text",
    name: "currentWork",
    message: "What are you working on right now?",
    hint: "Current projects, upcoming deadlines, anything top of mind",
  });

  const { workStyle } = await prompts({
    type: "text",
    name: "workStyle",
    message: "Anything about how you like to work? (Enter to skip)",
    hint: "e.g., 'In meetings 9-12, prefer async after 3pm'",
  });

  const { weekGoal } = await prompts({
    type: "text",
    name: "weekGoal",
    message: "What's the one thing you'd love help with this week?",
  });

  const contextAnswers = { currentWork, workStyle, weekGoal };

  // Write org-context.md
  const projectDir = process.cwd();
  await fs.writeFile(path.join(projectDir, "org-context.md"), generateOrgContext());
  success("Created org-context.md");

  // Write initial memory
  const memoryDir = path.join(projectDir, ".claude", "memory");
  await fs.ensureDir(memoryDir);
  await fs.writeFile(
    path.join(memoryDir, "user_profile.md"),
    generateInitialMemory(identityAnswers, contextAnswers)
  );
  success("Saved initial context to memory");

  // Create start.sh
  const startScript = `#!/bin/bash
cd ~/Documents/my-assistant
claude --channels plugin:telegram@claude-plugins-official
`;
  const startPath = path.join(projectDir, "start.sh");
  await fs.writeFile(startPath, startScript);
  await fs.chmod(startPath, "755");
  success("Created start.sh launcher");

  return contextAnswers;
}

export async function firstLaunch() {
  console.log("");
  const { launch } = await prompts({
    type: "confirm",
    name: "launch",
    message: "Ready to meet your assistant? Launch now?",
    initial: true,
  });

  if (launch) {
    info("Launching your assistant...");
    console.log("");
    const proc = launchClaude({ channels: true });
    await new Promise((resolve) => proc.on("close", resolve));
  } else {
    info("No problem! Start anytime with: ~/Documents/my-assistant/start.sh");
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/stages/context.js src/generators/org-context.js src/generators/memory.js
git commit -m "feat: add context gathering stage with org-context and memory generators"
```

---

### Task 8: Wire Up Main Entry Point

**Files:**
- Modify: `src/setup.js`

- [ ] **Step 1: Wire all stages into setup.js**

Replace `src/setup.js` with:

```javascript
import fs from "fs-extra";
import path from "path";
import { banner, section, success, completionBanner } from "./utils/display.js";
import { runPersonalityInterview } from "./stages/personality.js";
import { runTelegramSetup } from "./stages/telegram.js";
import { runConnectionsSetup } from "./stages/connections.js";
import { runContextGathering, firstLaunch } from "./stages/context.js";

async function main() {
  const projectDir = process.cwd();

  // Check for existing setup
  const identityPath = path.join(projectDir, "my-identity.md");
  const hasExisting = await fs.pathExists(identityPath);
  let existingContent = "";
  if (hasExisting) {
    existingContent = await fs.readFile(identityPath, "utf-8");
  }

  // Detect rerun
  const isRerun = hasExisting && !existingContent.includes("[FILL THIS IN]") && !existingContent.includes("[Pick");

  banner();

  let identityAnswers, soulAnswers, identityMd, soulMd;

  if (isRerun) {
    const prompts = (await import("prompts")).default;
    const { action } = await prompts({
      type: "select",
      name: "action",
      message: "You already have a personality configured. What would you like to do?",
      choices: [
        { title: "Reconfigure personality from scratch", value: "personality" },
        { title: "Keep personality, reconfigure connections", value: "connections" },
        { title: "Keep everything, just relaunch", value: "launch" },
      ],
    });

    if (action === "launch") {
      await firstLaunch();
      return;
    }

    if (action === "connections") {
      await runConnectionsSetup();
      await firstLaunch();
      return;
    }
  }

  // Stage 1+2: Personality interview
  const personality = await runPersonalityInterview();
  identityMd = personality.identityMd;
  soulMd = personality.soulMd;
  identityAnswers = personality.identityAnswers;
  soulAnswers = personality.soulAnswers;

  // Preview
  const prompts = (await import("prompts")).default;
  console.log("");
  success(`Generated personality for ${identityAnswers.name} ${identityAnswers.emoji}`);
  console.log("");

  const { approve } = await prompts({
    type: "confirm",
    name: "approve",
    message: "Look good? (You can always edit the files later)",
    initial: true,
  });

  if (!approve) {
    console.log("Run npm run setup again to start over.");
    return;
  }

  // Write files
  await fs.writeFile(path.join(projectDir, "my-identity.md"), identityMd);
  await fs.writeFile(path.join(projectDir, "my-soul.md"), soulMd);
  success("Saved my-identity.md and my-soul.md");

  // Stage 3: Telegram
  const telegram = await runTelegramSetup();

  // Stage 4: Optional connections
  const { connections } = await runConnectionsSetup();

  // Stage 5: Context + Launch
  const context = await runContextGathering(identityAnswers);

  // Final banner
  completionBanner({
    name: identityAnswers.name,
    emoji: identityAnswers.emoji,
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
```

- [ ] **Step 2: Commit**

```bash
git add src/setup.js
git commit -m "feat: wire all setup stages into main entry point with rerun detection"
```

---

### Task 9: Bootstrap Shell Script

**Files:**
- Create: `bootstrap.sh`

- [ ] **Step 1: Create bootstrap.sh**

Create `bootstrap.sh` at project root:

```bash
#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
RED='\033[0;31m'
DIM='\033[2m'
NC='\033[0m'

ok() { echo -e "${GREEN}✓${NC} $1"; }
doing() { echo -e "${ORANGE}→${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; }

echo ""
echo -e "${ORANGE}UnconstrainED AI Assistant — Bootstrapper${NC}"
echo ""

# OS check
if [[ "$OSTYPE" != "darwin"* ]]; then
  fail "This setup is for Mac only. Contact Alex for help with other platforms."
  exit 1
fi
ok "macOS detected"

# Homebrew
if command -v brew &>/dev/null; then
  ok "Homebrew found"
else
  doing "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || true
  ok "Homebrew installed"
fi

# Node.js
if command -v node &>/dev/null; then
  ok "Node.js found ($(node --version))"
else
  doing "Installing Node.js..."
  brew install node
  ok "Node.js installed ($(node --version))"
fi

# Bun
if command -v bun &>/dev/null; then
  ok "Bun found ($(bun --version))"
else
  doing "Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
  ok "Bun installed"
fi

# Claude Code CLI
if command -v claude &>/dev/null; then
  ok "Claude Code CLI found ($(claude --version 2>/dev/null || echo 'installed'))"
else
  doing "Installing Claude Code CLI..."
  npm install -g @anthropic-ai/claude-code
  ok "Claude Code CLI installed"
fi

# Git
if command -v git &>/dev/null; then
  ok "Git found"
else
  fail "Git is not installed. Install Xcode Command Line Tools: xcode-select --install"
  exit 1
fi

# Clone repo
DEST="$HOME/Documents/my-assistant"
if [ -d "$DEST" ]; then
  ok "Project directory exists at $DEST"
else
  doing "Cloning project..."
  git clone https://github.com/unconstrained-work/uc-teamkit.git "$DEST"
  ok "Project cloned to $DEST"
fi

# Install dependencies
doing "Installing dependencies..."
cd "$DEST"
npm install --silent
ok "Dependencies installed"

# Claude Code auth check
echo ""
doing "Checking Claude Code authentication..."
if claude --version &>/dev/null; then
  echo -e "${DIM}If you haven't logged in yet, you'll be prompted now.${NC}"
  claude auth login 2>/dev/null || true
fi

# Launch interactive setup
echo ""
echo -e "${GREEN}Prerequisites ready! Launching setup wizard...${NC}"
echo ""
npm run setup
```

- [ ] **Step 2: Make executable and commit**

```bash
chmod +x bootstrap.sh
git add bootstrap.sh
git commit -m "feat: add bootstrap.sh — one-command prereq installer and setup launcher"
```

---

### Task 10: Update CLAUDE.md and README.md

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Create: `docs/manual-setup.md`

- [ ] **Step 1: Update CLAUDE.md to reference org-context**

Add after the existing `@my-soul.md` line in the "Load Your Identity" section of `CLAUDE.md`:

```
- @org-context.md — Background on UnconstrainED, the team, and your clients
```

- [ ] **Step 2: Move current README to docs/manual-setup.md**

```bash
cp README.md docs/manual-setup.md
```

- [ ] **Step 3: Replace README.md**

Replace `README.md` with:

```markdown
# Your Personal AI Assistant

## Quick Start

Open Terminal and run:

```
curl -fsSL https://raw.githubusercontent.com/unconstrained-work/uc-teamkit/main/bootstrap.sh | bash
```

That's it. The setup wizard handles everything:
- Installs all prerequisites (Node.js, Bun, Claude Code)
- Walks you through designing your assistant's personality
- Connects Telegram so you can message it from your phone
- Optionally hooks up email, calendar, and more
- Launches your assistant

The whole process takes about 15 minutes.

## Day-to-Day

Start your assistant each morning:

```
~/Documents/my-assistant/start.sh
```

Leave Terminal open. Your assistant is available as long as Claude Code is running.

Your Mac needs to be awake for the bot to respond.

## Reconfigure

Want to change your assistant's personality or add new connections?

```
cd ~/Documents/my-assistant
npm run setup
```

## Edit Personality Directly

Your assistant's personality lives in two files:
- `my-identity.md` — name, personality, communication style, focus areas
- `my-soul.md` — values, boundaries, what success looks like

Edit them in any text editor. Restart Claude Code for changes to take effect.

## Need Help?

- Ask your assistant — it can troubleshoot most issues
- Check `docs/manual-setup.md` for detailed step-by-step instructions
- Reach out to Alex

## Troubleshooting

See `docs/manual-setup.md` for detailed troubleshooting, or ask your assistant:
"Hey, Telegram isn't working — help me debug"
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md README.md docs/manual-setup.md
git commit -m "feat: update CLAUDE.md with org-context, simplify README, preserve manual setup docs"
```

---

### Task 11: Update .gitignore and Clean Up

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Update .gitignore**

Add to `.gitignore`:

```
node_modules/
.setup-state.json
start.sh
org-context.md
```

Note: `my-identity.md` and `my-soul.md` stay tracked (they're templates until generated). `org-context.md` and `start.sh` are generated at runtime and shouldn't be committed.

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: update gitignore for generated files and node_modules"
```

---

### Task 12: End-to-End Verification

- [ ] **Step 1: Run npm run setup and verify each stage**

```bash
cd /c/Users/alexr/OneDrive/Documents/GitHub/ClaudeMigration/team-kit/uc_teamkit
npm run setup
```

Walk through the full flow:
1. Banner displays correctly with colors
2. Personality interview asks questions one at a time
3. Generated `my-identity.md` has correct content from answers
4. Generated `my-soul.md` has correct content
5. Telegram stage displays instructions and collects token
6. Connections stage shows multi-select menu
7. Context stage writes org-context.md and memory file
8. Completion banner shows correct summary
9. start.sh is created and executable

- [ ] **Step 2: Verify rerun behavior**

Run `npm run setup` again. Verify it detects existing configuration and offers three options:
- Reconfigure personality
- Reconfigure connections only
- Just relaunch

- [ ] **Step 3: Verify generated files**

Check each generated file has correct content:
```bash
cat my-identity.md
cat my-soul.md
cat org-context.md
cat start.sh
cat .claude/memory/user_profile.md
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete onboarding CLI — zero-to-working-assistant in one command"
```
