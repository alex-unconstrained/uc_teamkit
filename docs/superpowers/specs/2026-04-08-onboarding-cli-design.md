# Team Kit Onboarding CLI — Design Spec

**Date:** 2026-04-08
**Author:** Lucy / Alex Johnson
**Status:** Approved

## Overview

A zero-to-working-assistant CLI experience for UnconstrainED team members. One command installs all prerequisites, runs an interactive personality interview, connects Telegram, optionally hooks up email/calendar/Notion, gathers initial context, and launches the assistant. Non-technical users on Mac can complete it solo in ~15 minutes.

## Architecture: Two-Phase Approach

### Phase 1: Bootstrap Shell Script (`bootstrap.sh`)

A ~50-80 line bash script that handles system prerequisites. The user runs a single curl command:

```
curl -fsSL https://raw.githubusercontent.com/[org]/[repo]/main/bootstrap.sh | bash
```

**Steps (in order):**
1. Detect OS — Mac only. Clear exit message if Windows/Linux.
2. Check/install Homebrew — standard Homebrew install if missing.
3. Check/install Node.js — `brew install node` if missing.
4. Check/install Bun — Bun install script if missing. Required by Telegram plugin.
5. Check/install Claude Code CLI — `npm install -g @anthropic-ai/claude-code` if missing.
6. Check/install Git — verify present (standard on Mac).
7. Clone the repo — `git clone [REPO_URL] ~/Documents/my-assistant`. Skip if directory exists (supports rerun).
8. Install Node dependencies — `cd ~/Documents/my-assistant && npm install`.
9. Hand off — `npm run setup`.

**Output format per step:**
- `✓ Node.js found (v22.18.0)` — already installed
- `→ Installing Bun...` — installing now
- `✗ Failed to install Bun. Try running: curl -fsSL https://bun.sh/install | bash` — failure with manual fix

If any critical step fails, print error + manual fix suggestion and exit.

### Phase 2: Interactive Node CLI (`src/setup.js`)

A Node.js CLI app using the `prompts` library for rich terminal UI. Invoked via `npm run setup`. Independently rerunnable for reconfiguration.

**Dependencies:** `prompts` (interactive prompts), `chalk` (colors), `ora` (spinners), `fs-extra` (file writing).

## Phase 2 Detail: Five Stages

### Stage 1: Personality Interview → Generates `my-identity.md`

**Opening banner:**
```
┌─────────────────────────────────────────┐
│  Welcome to UnconstrainED AI Setup  ✨  │
│  Let's build your personal assistant.   │
└─────────────────────────────────────────┘

This will take about 10-15 minutes. We'll:
  1. Design your assistant's personality
  2. Connect it to Telegram
  3. Optionally connect email, calendar, and more
  4. Launch your assistant

You can rerun this anytime with: npm run setup
```

**Questions (one at a time):**

1. **Name** — free text with suggestions: "Some people pick names like Atlas, Nova, Scout, Sage — or anything you want."

2. **Emoji** — curated grid of 12-15 options (🧭 🔥 🦉 🚀 💡 🛡️ 🎯 🌊 🤖 ⚡ 🧠 🌿) plus "type your own."

3. **Vibe** — single select:
   - Direct and sharp — gets to the point, no fluff
   - Warm and encouraging — supportive, celebrates wins
   - Calm and thoughtful — steady, asks good questions
   - Energetic and proactive — high-energy, action-oriented
   - Dry and witty — understated humor, observations over jokes
   - Custom — describe your own

4. **Communication style** — multi-select checklist:
   - Short, punchy sentences
   - Conversational and relaxed
   - Professional but not stiff
   - Uses occasional humor
   - Asks before diving in
   - Gives the answer first, explains after
   - Uses analogies and examples
   - Straight to the point, minimal small talk

5. **Focus at UnconstrainED** — multi-select:
   - Course design and facilitation
   - Client relations and partnerships
   - Product and tool development
   - Operations and logistics
   - Marketing and content
   - Strategy and business development
   - Other: ___

6. **What your assistant should help with** — multi-select:
   - Workshop and session prep
   - Course content development
   - Client communication and proposals
   - Research on AI in education
   - Data analysis and reporting
   - Marketing and newsletter content
   - Internal operations and scheduling
   - Tool building and product work
   - Other: ___

7. **Your name and role** — two prompts: "What should they call you?" and "What's your role at UnconstrainED?"

8. **Current clients/schools** — free text: "What schools or clients are you currently working with? E.g., 'Morrison Academy, TASIS, Beacon'"

9. **Quirk (optional)** — show examples from Coach ("calls tasks 'reps'") and Navigator ("says 'the real question here might be...'"), then free text for 1-2 quirks. Skippable.

**Output:** Generates `my-identity.md` matching existing template structure.

### Stage 2: Values Interview → Generates `my-soul.md`

10. **Communication rules** — show the 4 defaults (no filler, be honest, earn trust, match energy). "Keep these as-is, or customize?" Most will keep.

11. **Boundaries (optional)** — free text with examples shown. Skippable. Pre-seed: "Check with the team before making external commitments on behalf of UnconstrainED."

12. **What success looks like (optional)** — free text with examples. Skippable.

13. **What annoys you (optional)** — free text with examples. Skippable.

**Output:** Generates `my-soul.md` matching existing template structure.

**Preview gate:** Show generated files: "Here's what I generated — look good?" Options: Accept / Edit a section / Start over.

### Stage 3: Telegram Setup

1. **"Have you already created a Telegram bot?"** — Yes/No
   - No → step-by-step instructions printed in terminal (open Telegram, search @BotFather, /newbot, pick name, pick username, copy token)
   - Yes → skip instructions

2. **"Paste your bot token:"** — validate format (`digits:alphanumeric`). Retry on invalid.

3. **Automated plugin setup** — CLI spawns Claude Code process programmatically and runs:
   - `/plugin marketplace add anthropics/claude-plugins-official`
   - `/plugin install telegram@claude-plugins-official`
   - `/reload-plugins`
   - `/telegram:configure TOKEN`
   Show spinner: `→ Installing Telegram plugin...` → `✓ Telegram plugin configured`

4. **Launch Claude Code with channels flag** in child process, then prompt: "Now open Telegram and send your bot any message. It will reply with a pairing code. Paste the pairing code here:"

5. **Run pairing** programmatically: `/telegram:access pair CODE`

6. **Auto-lockdown:** `/telegram:access policy allowlist` — no question, just confirm: `✓ Telegram paired and secured`

7. **Verify:** "Send your bot 'Hi, who are you?' on Telegram. Did it respond in character? (yes/no)" — if no, show troubleshooting tips inline with retry option.

### Stage 4: Optional Connections

Multi-select menu:
```
Want to connect more tools? Select any you'd like:
  [ ] Gmail — read and search your email
  [ ] Google Calendar — check your schedule
  [ ] Notion — search and create workspace pages  
  [ ] Microsoft 365 / Outlook — work email
  [ ] Skip for now
```

For each selected connection:
1. Print what it does and what will happen
2. Launch Claude Code
3. Instruct user to run `/mcp`, select the connector, complete browser OAuth
4. Ask: "Did the connection succeed? (yes/no/skip)"
5. Move to next

Summary after completion:
```
✓ Connections complete!
  Telegram  ✓
  Gmail     ✓
  Calendar  skipped
  Notion    skipped
```

**Future connections breadcrumb:**
```
As you get comfortable, there's more you can do:
  → Connect Zoom for meeting summaries
  → Connect Google Drive for document access
  → Add scheduled briefings and email checks
  → Build custom skills for your workflows

Ask your assistant about any of these, or talk to Alex.
```

### Stage 5: Context Gathering & First Launch

**Questions:**

1. **"What are you working on right now?"** — free text. "Current projects, upcoming deadlines, anything top of mind."

2. **"How do you like to work?"** — free text with examples: "E.g., 'In meetings 9-12, prefer async after 3pm, hate long emails'" Optional skip.

3. **"What's the one thing you'd love help with this week?"** — free text. Becomes first proactive follow-up item.

**Outputs:**
- Writes `org-context.md` to project root with UnconstrainED company info (products, courses, team, clients)
- Writes initial memory file with user's role, focus, current projects, work style, and first-week goal
- Updates `CLAUDE.md` to reference `@org-context.md`
- Creates `start.sh` launcher script at `~/Documents/my-assistant/start.sh` (executable)

**First launch:**
```
Ready to meet your assistant?
Launching now...
```

Launches Claude Code with channels flag. The assistant detects fresh setup (memory file with `first_setup: true` flag) and sends an introductory Telegram message acknowledging the user's name, role, and current work.

**Final summary (shown after exit or on rerun):**
```
┌─────────────────────────────────────────┐
│  Setup complete! 🎉                     │
│                                         │
│  Your assistant: [Name] [Emoji]         │
│  Telegram bot: @[bot_username]          │
│  Connections: Telegram, Gmail, Calendar  │
│                                         │
│  Start each day:                        │
│    ~/Documents/my-assistant/start.sh    │
│                                         │
│  Reconfigure anytime:                   │
│    cd ~/Documents/my-assistant          │
│    npm run setup                        │
│                                         │
│  Questions? Ask your assistant or Alex. │
└─────────────────────────────────────────┘
```

## File Structure (additions to existing kit)

```
uc_teamkit/
├── bootstrap.sh                    # Phase 1: prereq installer
├── package.json                    # Updated: adds setup deps + "setup" script
├── src/
│   ├── setup.js                    # Phase 2: main interactive CLI
│   ├── stages/
│   │   ├── personality.js          # Stage 1+2: interview → identity + soul
│   │   ├── telegram.js             # Stage 3: bot creation + plugin + pairing
│   │   ├── connections.js          # Stage 4: optional MCP connections
│   │   └── context.js              # Stage 5: context gathering + launch
│   ├── generators/
│   │   ├── identity.js             # Template renderer for my-identity.md
│   │   ├── soul.js                 # Template renderer for my-soul.md
│   │   ├── org-context.js          # Generates org-context.md
│   │   └── memory.js               # Generates initial memory file
│   └── utils/
│       ├── claude.js               # Spawn/interact with Claude Code process
│       ├── display.js              # Banner, spinner, formatting helpers
│       └── validators.js           # Input validation (token format, etc.)
├── org-context.md                  # Generated: UnconstrainED company info
├── start.sh                        # Generated: daily launcher script
├── my-identity.md                  # Generated (replaces template)
├── my-soul.md                      # Generated (replaces template)
├── CLAUDE.md                       # Updated: references org-context.md
├── README.md                       # Updated: simplified to "run one command"
├── SETUP-CHECKLIST.md              # Updated or replaced by CLI verification
├── examples/                       # Kept: still useful as reference
│   ├── identity-example-coach.md
│   └── identity-example-navigator.md
└── .claude/
    └── settings.json               # Existing: tool permissions
```

## Rerun Behavior

Running `npm run setup` on an existing installation:
1. Detects existing `my-identity.md` / `my-soul.md` — asks: "You already have a personality configured ([Name] [Emoji]). What would you like to do?"
   - Reconfigure personality from scratch
   - Keep personality, reconfigure connections
   - Keep everything, just relaunch
2. Detects existing Telegram config — asks: "Telegram is already configured. Reconfigure? (yes/no)"
3. Skips bootstrap prereqs entirely (those are already installed)

## org-context.md Content

Pre-written file with UnconstrainED company context:

```markdown
# About UnconstrainED

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
```

## Updates to Existing Files

### README.md
Dramatically simplified. The 9-step guide becomes:

```markdown
# Your Personal AI Assistant

## Quick Start

Open Terminal and run:

curl -fsSL https://[url]/bootstrap.sh | bash

That's it. The setup wizard handles everything else.

## Day-to-Day

Start your assistant:
~/Documents/my-assistant/start.sh

## Reconfigure

cd ~/Documents/my-assistant
npm run setup

## Need Help?
Ask your assistant, or reach out to Alex.
```

The current detailed README content moves to a `docs/manual-setup.md` for reference.

### CLAUDE.md
Add one line to the "Load Your Identity" section:
```
- @org-context.md — Background on UnconstrainED, the team, and your clients
```

### package.json
Add:
```json
{
  "scripts": {
    "setup": "node src/setup.js"
  },
  "dependencies": {
    "prompts": "^2.4.2",
    "chalk": "^5.3.0",
    "ora": "^8.0.0",
    "fs-extra": "^11.2.0"
  }
}
```

## Edge Cases

- **User Ctrl+C during interview:** Save partial progress to `.setup-state.json`. On rerun, offer to resume or start over.
- **Bot token already configured:** Detect existing Telegram config, ask to keep or reconfigure.
- **No internet:** Fail gracefully at bootstrap with "This setup requires an internet connection."
- **Repo already cloned:** Skip clone step, proceed to `npm install` + `npm run setup`.
- **Claude Code auth expired:** Detect and prompt `claude auth login` before proceeding to Telegram setup.
- **Plugin install fails:** Retry once, then show manual steps as fallback.
