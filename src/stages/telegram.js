import prompts from 'prompts';
import { section, success, info, warn, DIM } from '../utils/display.js';
import { validateBotToken, validatePairingCode } from '../utils/validators.js';
import { runClaudeCommands } from '../utils/claude.js';

export async function runTelegramSetup() {
  section('Step 3: Connect Telegram');

  // Step 1: Check if user already has a bot
  const { hasBotAlready } = await prompts({
    type: 'confirm',
    name: 'hasBotAlready',
    message: 'Have you already created a Telegram bot?',
    initial: false,
  });

  // Step 2: If no, walk them through BotFather
  if (!hasBotAlready) {
    console.log('');
    console.log(DIM('  How to create your bot:'));
    console.log(DIM('  1. Open Telegram and search for @BotFather'));
    console.log(DIM('  2. Send /start'));
    console.log(DIM('  3. Send /newbot'));
    console.log(DIM('  4. Choose a display name for your bot (e.g. "My Assistant")'));
    console.log(DIM('  5. Choose a username ending in "bot" (e.g. "myassistant_bot")'));
    console.log(DIM('  6. Copy the token BotFather gives you'));
    console.log('');
  }

  // Step 3: Collect and validate bot token
  let token;
  while (true) {
    const { rawToken } = await prompts({
      type: 'text',
      name: 'rawToken',
      message: 'Paste your bot token:',
    });

    if (!rawToken) {
      return { success: false, token: null };
    }

    if (validateBotToken(rawToken)) {
      token = rawToken.trim();
      break;
    } else {
      warn('Invalid token format. Expected something like: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz');
    }
  }

  // Step 4: Auto-run plugin setup
  info('Installing Telegram plugin...');
  const pluginResults = await runClaudeCommands([
    '/plugin marketplace add anthropics/claude-plugins-official',
    '/plugin install telegram@claude-plugins-official',
    '/reload-plugins',
    `/telegram:configure ${token}`,
  ]);

  const pluginFailed = pluginResults.some((r) => !r.success);

  if (pluginFailed) {
    console.log('');
    warn('Plugin setup hit a snag. You can do it manually:');
    console.log(DIM('  1. Open Claude and run: /plugin marketplace add anthropics/claude-plugins-official'));
    console.log(DIM('  2. Run: /plugin install telegram@claude-plugins-official'));
    console.log(DIM('  3. Run: /reload-plugins'));
    console.log(DIM(`  4. Run: /telegram:configure ${token}`));
    console.log('');

    const { continueAnyway } = await prompts({
      type: 'confirm',
      name: 'continueAnyway',
      message: 'Continue anyway?',
      initial: true,
    });

    if (!continueAnyway) {
      return { success: false, token };
    }
  } else {
    success('Plugin installed and configured.');
  }

  // Step 5: Prompt user to message the bot and collect pairing code
  console.log('');
  info('Assistant is starting. Open Telegram and send your bot a message to get a pairing code.');

  const { pairingCode } = await prompts({
    type: 'text',
    name: 'pairingCode',
    message: 'Enter the pairing code your bot sent you:',
    validate: (value) => {
      if (!validatePairingCode(value)) {
        return 'Pairing code must be 4–20 characters.';
      }
      return true;
    },
  });

  if (!pairingCode) {
    return { success: false, token };
  }

  // Step 6: Run pairing commands
  info('Pairing and configuring access policy...');
  const pairResults = await runClaudeCommands([
    `/telegram:access pair ${pairingCode.trim()}`,
    '/telegram:access policy allowlist',
  ]);

  const pairFailed = pairResults.some((r) => !r.success);

  if (pairFailed) {
    warn('Pairing may not have completed fully. Check Claude for errors.');
  } else {
    success('Telegram paired and access policy set to allowlist.');
  }

  // Step 7: Verify
  console.log('');
  info('Test it: send your bot "Hi, who are you?" on Telegram.');

  const { botResponded } = await prompts({
    type: 'confirm',
    name: 'botResponded',
    message: 'Did it respond in character?',
    initial: false,
  });

  if (!botResponded) {
    console.log('');
    warn('Something may be off. Troubleshooting tips:');
    console.log(DIM('  • Make sure the bot token is correct and not revoked'));
    console.log(DIM('  • Re-run /telegram:configure <token> in Claude'));
    console.log(DIM('  • Check that /reload-plugins ran successfully'));
    console.log(DIM('  • Confirm the pairing code matched what the bot sent'));
    console.log(DIM('  • Restart Claude and try messaging the bot again'));
    console.log('');
    return { success: false, token };
  }

  success('Telegram is connected and working.');
  return { success: true, token };
}
