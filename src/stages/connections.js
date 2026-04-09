import prompts from 'prompts';
import { section, success, info, DIM } from '../utils/display.js';
import { launchClaude } from '../utils/claude.js';

const CONNECTIONS = [
  { title: 'Gmail — read and search your email', value: 'Gmail' },
  { title: 'Google Calendar — check your schedule, find conflicts', value: 'Google Calendar' },
  { title: 'Notion — search and create workspace pages', value: 'Notion' },
  { title: 'Microsoft 365 / Outlook — work email access', value: 'Microsoft 365' },
];

const onCancel = () => process.exit(0);

export async function runConnectionsSetup() {
  section('Step 4: Connect More Tools (Optional)');
  console.log('These are optional — you can always add them later.');
  console.log('');

  const { wantConnections } = await prompts({
    type: 'confirm',
    name: 'wantConnections',
    message: 'Want to connect any additional tools now?',
    initial: true,
  }, { onCancel });

  if (!wantConnections) {
    info('Skipping. You can add them anytime with: npm run setup');
    return { connections: [] };
  }

  const { selected } = await prompts({
    type: 'multiselect',
    name: 'selected',
    message: 'Which tools? (Space to select, Enter to confirm)',
    choices: CONNECTIONS,
    hint: 'Space to select',
  }, { onCancel });

  if (!selected || selected.length === 0) {
    info('None selected. You can add them later.');
    return { connections: [] };
  }

  const connected = [];

  for (const name of selected) {
    info(`Connecting ${name}...`);

    console.log(DIM('  1. Claude Code will open.'));
    console.log(DIM('  2. Type /mcp and press Enter.'));
    console.log(DIM(`  3. Select the ${name} connector.`));
    console.log(DIM('  4. Complete the browser auth flow.'));
    console.log(DIM('  5. Close Claude Code when done.'));

    const { launch } = await prompts({
      type: 'confirm',
      name: 'launch',
      message: 'Press Enter to launch Claude Code...',
      initial: true,
    });

    if (launch !== false) {
      const proc = launchClaude({ channels: false });
      await new Promise((resolve) => proc.on('close', resolve));
    }

    const { result } = await prompts({
      type: 'select',
      name: 'result',
      message: `Did ${name} connect successfully?`,
      choices: [
        { title: 'Yes', value: 'yes' },
        { title: 'No / Skip', value: 'no' },
      ],
    });

    if (result === 'yes') {
      success(`${name} connected.`);
      connected.push(name);
    } else {
      info(`Skipped — you can connect ${name} later.`);
    }
  }

  // Summary
  if (connected.length > 0) {
    console.log('');
    console.log('Connected:');
    for (const name of connected) {
      console.log(`  • ${name}`);
    }
  }

  console.log('');
  console.log(
    DIM(
      'More integrations available later: Zoom, Google Drive, scheduled briefings, custom skills. ' +
        'Ask your assistant about any of these, or talk to Alex.'
    )
  );

  return { connections: connected };
}
