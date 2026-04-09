# Your Personal AI Assistant — Setup Guide

This guide walks you through setting up your own personal AI assistant that you can message on Telegram. The whole process takes about 40 minutes.

**What you'll have when you're done:** A Telegram bot with its own personality that you designed, powered by Claude, running on your Mac. Message it anytime your computer is on and Claude Code is running.

---

## Prerequisites

Before we start, make sure you have:
- A Mac computer
- Your company Claude account credentials (email + password)
- Telegram installed on your phone
- About 40 minutes

---

## Step 1: Install Claude Code Desktop (5 min)

1. Open your browser and go to **https://claude.ai/download**
2. Download the **Mac** version
3. Open the downloaded `.dmg` file and drag Claude to your Applications folder
4. Open Claude from Applications
5. **Sign in** with your company Claude account (the same email/password you use for claude.ai)
6. When asked to select your organization, choose the team organization

**How to verify:** You should see the Claude Desktop app open with a chat interface. You should see a "Code" tab at the top.

---

## Step 2: Install Bun (3 min)

Bun is a small tool that the Telegram plugin needs to run. We'll install it using Terminal.

1. Open **Terminal** (press `Cmd + Space`, type "Terminal", press Enter)
2. Copy and paste this entire command, then press Enter:

```
curl -fsSL https://bun.sh/install | bash
```

3. Wait for it to finish (about 30 seconds)
4. **Close Terminal completely** (Cmd + Q) and **reopen it** — this is important so it picks up the new install

**How to verify:** In Terminal, type `bun --version` and press Enter. You should see a version number like `1.x.x`.

---

## Step 3: Install Claude Code CLI (3 min)

The Telegram bot runs through Claude Code's command-line tool. We need to install that too.

1. In Terminal, copy and paste this command:

```
npm install -g @anthropic-ai/claude-code
```

If you get a "permission denied" error, try:

```
sudo npm install -g @anthropic-ai/claude-code
```

(It will ask for your Mac password — type it and press Enter. You won't see the characters as you type, that's normal.)

If you get "npm: command not found", install Node.js first:

```
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Close and reopen Terminal, then:

```
nvm install --lts
npm install -g @anthropic-ai/claude-code
```

2. After installation, authenticate Claude Code with your account:

```
claude auth login
```

Choose **claude.ai** when asked, and follow the browser prompts to sign in with your company account.

**How to verify:** Type `claude --version` in Terminal. You should see a version number.

---

## Step 4: Clone This Repository (3 min)

1. In Terminal, navigate to where you want to keep this project. Your Documents folder is a good spot:

```
cd ~/Documents
```

2. Clone the repository:

```
git clone https://github.com/alex-unconstrained/uc_teamkit.git my-assistant
```

3. Open the folder:

```
cd my-assistant
```

**How to verify:** Type `ls` and press Enter. You should see files like `CLAUDE.md`, `my-identity.md`, `my-soul.md`, etc.

---

## Step 5: Personalize Your Assistant (15 min)

This is the fun part — you're designing your assistant's personality.

1. Open the `my-assistant` folder in Finder (type `open .` in Terminal)
2. Open **my-identity.md** in any text editor (TextEdit works, or right-click > Open With > TextEdit)
   - If TextEdit shows weird formatting, go to TextEdit > Settings > check "Plain text" under New Document format, then reopen the file
3. Fill in each section — replace everything in `[brackets]` with your own choices
4. Check the `examples/` folder for inspiration:
   - `identity-example-coach.md` — a motivating accountability partner
   - `identity-example-navigator.md` — a calm research-oriented advisor
5. Open **my-soul.md** and customize it too — this defines your assistant's values and rules

**Tips:**
- You can always change these later — nothing is permanent
- The more specific you are, the more distinctive your assistant will be
- Have fun with the quirks section — that's what makes it feel like *your* assistant

**How to verify:** Open both files and make sure there are no `[brackets]` left — everything should be filled in with your own text.

---

## Step 6: Create Your Telegram Bot (5 min)

1. Open Telegram on your phone
2. Search for **@BotFather** (it has a blue checkmark)
3. Tap **Start** or send `/start`
4. Send `/newbot`
5. BotFather asks for a **display name** — type whatever you want (e.g., "My Work Assistant")
6. BotFather asks for a **username** — this must end in `bot` (e.g., `jamie_work_bot`). If the name is taken, try adding numbers
7. BotFather gives you a **token** — it looks like `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
8. **Copy this token** — you'll need it in the next step. You can also message it to yourself or paste it in Notes for easy access

**How to verify:** You should have a long token that looks like numbers, a colon, then letters and numbers.

---

## Step 7: Connect Telegram to Claude Code (5 min)

Now we connect everything together.

1. In Terminal, make sure you're in your assistant's folder:

```
cd ~/Documents/my-assistant
```

2. Start Claude Code:

```
claude
```

3. Once Claude Code is running (you'll see a prompt where you can type), run these commands one at a time:

```
/plugin marketplace add anthropics/claude-plugins-official
```

```
/plugin install telegram@claude-plugins-official
```

Wait for each command to finish before running the next one.

4. Reload plugins:

```
/reload-plugins
```

5. Configure your Telegram bot token (replace `YOUR_TOKEN_HERE` with the token from Step 6):

```
/telegram:configure YOUR_TOKEN_HERE
```

6. **Exit Claude Code** by typing `/exit` or pressing `Ctrl + C`

7. Now restart Claude Code with the Telegram channel enabled:

```
claude --channels plugin:telegram@claude-plugins-official
```

**How to verify:** Claude Code should start without errors. You should see something about the Telegram plugin being loaded.

---

## Step 8: Pair Your Telegram Account (3 min)

1. On your phone, open Telegram
2. Find your bot (search for the username you created in Step 6)
3. Send it any message — like "hello"
4. The bot will reply with a **pairing code** (a short code like `abc123`)
5. Back in Terminal where Claude Code is running, type:

```
/telegram:access pair YOUR_CODE_HERE
```

(Replace `YOUR_CODE_HERE` with the code the bot sent you)

6. Lock down your bot so only you can use it:

```
/telegram:access policy allowlist
```

**How to verify:** Send another message to your bot on Telegram. This time it should respond with your assistant's personality!

---

## Step 9: Test It! (5 min)

Send your bot a few messages to make sure everything works:

1. **"Hi, who are you?"** — It should introduce itself using the name and personality you defined
2. **"What can you help me with?"** — It should mention your focus areas from the identity file
3. **"What's in the news about AI today?"** — It should search the web and give you a summary

If the bot responds in character, congratulations — you're all set!

---

## Day-to-Day Usage

### Starting your assistant

Every time you want your assistant available on Telegram, open Terminal and run:

```
cd ~/Documents/my-assistant
claude --channels plugin:telegram@claude-plugins-official
```

**Leave this Terminal window open.** Your assistant is only available while Claude Code is running.

### Keeping it running

- Your Mac needs to be **on and awake** for the bot to respond
- To prevent your Mac from sleeping: **System Settings > Energy > Turn display off after: Never** (or set a long time)
- You can minimize the Terminal window — it doesn't need to be in the foreground

### Stopping your assistant

- Press `Ctrl + C` in Terminal, or close the Terminal window
- Your bot will stop responding until you start it again

### Updating your personality

1. Edit `my-identity.md` or `my-soul.md` in any text editor
2. Restart Claude Code (Ctrl + C, then run the start command again)
3. Changes take effect immediately

---

## Troubleshooting

### Installation Issues

#### "command not found: claude"
Close Terminal completely and reopen it. If that doesn't work, reinstall:
```
npm install -g @anthropic-ai/claude-code
```

#### "command not found: bun"
Close Terminal completely and reopen it. If still not found:
```
curl -fsSL https://bun.sh/install | bash
```
Then close and reopen Terminal.

#### Permission denied errors
Add `sudo` before the command:
```
sudo npm install -g @anthropic-ai/claude-code
```

#### "This feature requires a claude.ai subscription"
Make sure you logged in with your company Claude account, not a personal one:
```
claude auth login
```
Choose claude.ai and select the team organization.

---

### Telegram Issues

#### Bot doesn't respond at all
Check these in order:

1. **Is Claude Code running?** Look at your Terminal — you should see the Claude Code prompt. If Terminal is closed or shows your normal `$` prompt, Claude Code isn't running.

2. **Did you use the `--channels` flag?** This is the most common mistake. If you started Claude Code with just `claude` instead of `claude --channels plugin:telegram@claude-plugins-official`, Telegram isn't connected. Stop Claude Code (Ctrl + C) and restart with the full command.

3. **Did you complete pairing?** The bot won't respond to unpaired users. If you're not sure, try the pairing flow again from Step 8.

4. **Is your Mac awake?** If your Mac went to sleep, the bot stops responding. Wake it up and check if Claude Code is still running in Terminal.

#### Bot sends a pairing code but `/telegram:access pair CODE` fails
- **Type the code exactly** as it appears — it's case-sensitive
- **Pairing codes expire after a few minutes.** If too much time passed, send another message to the bot on Telegram to get a fresh code, then pair immediately
- Make sure you're running the command inside Claude Code (the `/` prompt), not in your regular Terminal

#### Pairing code never appears — bot just ignores me
- The Telegram plugin may not have loaded. Stop Claude Code and restart with:
  ```
  claude --channels plugin:telegram@claude-plugins-official
  ```
  Watch the startup output — you should see the Telegram plugin mentioned. If you see errors about the plugin, jump to "Plugin errors" below.

#### Bot was working but stopped
- **Check Terminal** — if you see an error or the process exited, just restart:
  ```
  cd ~/Documents/my-assistant && claude --channels plugin:telegram@claude-plugins-official
  ```
- **Mac went to sleep** — the bot stops when your Mac sleeps. Wake it up and restart if needed.
- **Session timed out** — long-running sessions can eventually time out. Restart Claude Code.

#### Bot responds but ignores my personality
- Check that `my-identity.md` and `my-soul.md` are in the same folder as `CLAUDE.md`
- Make sure you actually saved the files after editing
- Restart Claude Code — it reads these files at startup, not on the fly

#### I want to change my bot token or switch to a new bot
1. Start Claude Code: `cd ~/Documents/my-assistant && claude`
2. Run `/telegram:configure NEW_TOKEN_HERE`
3. Exit and restart with channels:
   ```
   claude --channels plugin:telegram@claude-plugins-official
   ```
4. You'll need to re-pair (Step 8) since it's a new bot

#### Someone else is messaging my bot
If you skipped the allowlist step or want to check your security:
1. In Claude Code, run:
   ```
   /telegram:access policy allowlist
   ```
   This ensures only paired users (you) can use the bot. Anyone else who messages it will be ignored.

---

### Plugin Issues

#### "plugin not found" error
Run this first to add the plugin marketplace, then retry the install:
```
/plugin marketplace add anthropics/claude-plugins-official
```
Then:
```
/plugin install telegram@claude-plugins-official
```

#### Plugin install fails or Telegram plugin won't load
This usually means Bun isn't installed properly. Verify:
```
bun --version
```
If you get "command not found", go back to Step 2 and install Bun. The Telegram plugin requires Bun to run — it won't work without it.

#### Startup errors about channels or plugins
If you see errors when starting with `--channels`, try a clean reinstall of the plugin:
```
claude
```
Then inside Claude Code:
```
/plugin install telegram@claude-plugins-official
/reload-plugins
/exit
```
Then restart with the full command:
```
claude --channels plugin:telegram@claude-plugins-official
```

---

## Updating Claude Code

Claude Code gets frequent updates. If things stop working after an update, or if you're asked to update:

```
npm update -g @anthropic-ai/claude-code
```

After updating, restart your assistant normally. Your personality files and Telegram pairing are preserved — you don't need to redo setup.

If an update breaks the Telegram plugin, reinstall it:
```
claude
/plugin install telegram@claude-plugins-official
/reload-plugins
/exit
```
Then restart with the full command.

---

## Quick Reference

| What | Command |
|---|---|
| Start your assistant | `cd ~/Documents/my-assistant && claude --channels plugin:telegram@claude-plugins-official` |
| Stop your assistant | `Ctrl + C` in Terminal |
| Check Claude Code version | `claude --version` |
| Check Bun version | `bun --version` |
| Re-authenticate | `claude auth login` |
| Update Claude Code | `npm update -g @anthropic-ai/claude-code` |

---

## Getting Help

If you're stuck and the troubleshooting section doesn't cover it, reach out to Alex — he's been through every possible version of this breaking and can help debug.
