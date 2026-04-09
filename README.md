# Your Personal AI Assistant

## Quick Start

Open Terminal and run:

```
curl -fsSL https://raw.githubusercontent.com/alex-unconstrained/uc_teamkit/main/bootstrap.sh | bash
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
