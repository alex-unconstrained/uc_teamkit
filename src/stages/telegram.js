import prompts from 'prompts';
import { section, success, info, warn, DIM } from '../utils/display.js';
import { validateBotToken, validatePairingCode } from '../utils/validators.js';
import { launchClaude } from '../utils/claude.js';

const onCancel = () => process.exit(0);

export async function runTelegramSetup() {
  section('Step 3: Connect Telegram');

  // Step 1: Check if user already has a bot
  const { hasBotAlready } = await prompts({
    type: 'confirm',
    name: 'hasBotAlready',
    message: 'Have you already created a Telegram bot?',
    initial: false,
  }, { onCancel });

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

  // Step 4: Guide user through plugin setup inside Claude Code
  console.log('');
  info('Now we need to install the Telegram plugin inside Claude Code.');
  console.log('');
  console.log('When Claude Code opens, run these commands one at a time:');
  console.log('');
  console.log(DIM('  /plugin marketplace add anthropics/claude-plugins-official'));
  console.log(DIM('  /plugin install telegram@claude-plugins-official'));
  console.log(DIM('  /reload-plugins'));
  console.log(DIM(`  /telegram:configure ${token.slice(0, 6)}...${token.slice(-4)}`));
  console.log('');
  console.log(DIM(`  (Your full token for copy-paste: ${token})`));
  console.log('');
  console.log(DIM('  When all four are done, type /exit to come back here.'));
  console.log('');

  const { readyPlugin } = await prompts({
    type: 'confirm',
    name: 'readyPlugin',
    message: 'Press Enter to open Claude Code...',
    initial: true,
  }, { onCancel });

  if (readyPlugin) {
    const proc = launchClaude({ channels: false });
    await new Promise((resolve) => proc.on('close', resolve));
  }

  const { pluginDone } = await prompts({
    type: 'confirm',
    name: 'pluginDone',
    message: 'Did you complete all four commands?',
    initial: true,
  }, { onCancel });

  if (!pluginDone) {
    warn('You can finish plugin setup later. Run the commands above inside Claude Code.');
    return { success: false, token };
  }

  success('Plugin configured.');

  // Step 5: Pairing — restart with channels flag
  console.log('');
  info('Restarting with Telegram enabled for pairing...');
  console.log('');
  console.log('Open Telegram and send your bot any message.');
  console.log('It will reply with a ' + DIM('pairing code') + '.');
  console.log(DIM('Then type /exit in Claude Code to come back here.'));
  console.log('');

  const { readyPair } = await prompts({
    type: 'confirm',
    name: 'readyPair',
    message: 'Press Enter to launch...',
    initial: true,
  }, { onCancel });

  if (readyPair) {
    const proc = launchClaude({ channels: true });
    await new Promise((resolve) => proc.on('close', resolve));
  }

  const { pairingCode } = await prompts({
    type: 'text',
    name: 'pairingCode',
    message: 'Paste the pairing code here:',
    validate: (value) => {
      if (!validatePairingCode(value)) return 'Pairing code must be 4-20 characters.';
      return true;
    },
  }, { onCancel });

  if (!pairingCode) {
    return { success: false, token };
  }

  // Step 6: Run pairing and lockdown inside Claude Code
  console.log('');
  info('One more step — pairing your account. When Claude Code opens, run:');
  console.log('');
  console.log(DIM(`  /telegram:access pair ${pairingCode.trim()}`));
  console.log(DIM('  /telegram:access policy allowlist'));
  console.log(DIM('  /exit'));
  console.log('');

  const { readyLock } = await prompts({
    type: 'confirm',
    name: 'readyLock',
    message: 'Press Enter to open Claude Code...',
    initial: true,
  }, { onCancel });

  if (readyLock) {
    const proc = launchClaude({ channels: true });
    await new Promise((resolve) => proc.on('close', resolve));
  }

  success('Telegram paired and secured.');

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
