import chalk from 'chalk';

export const ORANGE = chalk.hex('#f5a623');
export const DIM = chalk.dim;
export const BOLD = chalk.bold;
export const GREEN = chalk.green;
export const RED = chalk.red;
export const CYAN = chalk.cyan;

export function banner() {
  console.log('');
  console.log(ORANGE('┌─────────────────────────────────────────┐'));
  console.log(ORANGE('│') + '  Welcome to UnconstrainED AI Setup  ✨  ' + ORANGE('│'));
  console.log(ORANGE('│') + '  Let\'s build your personal assistant.   ' + ORANGE('│'));
  console.log(ORANGE('└─────────────────────────────────────────┘'));
  console.log('');
  console.log(DIM('This will take about 10-15 minutes. We\'ll:'));
  console.log(DIM('  1. Design your assistant\'s personality'));
  console.log(DIM('  2. Connect it to Telegram'));
  console.log(DIM('  3. Optionally connect email, calendar, and more'));
  console.log(DIM('  4. Launch your assistant'));
  console.log('');
  console.log(DIM('You can rerun this anytime with: npm run setup'));
  console.log('');
}

export function section(title) {
  console.log('');
  console.log(ORANGE(`── ${title} ──`));
}

export function success(msg) {
  console.log(GREEN('✓ ') + msg);
}

export function info(msg) {
  console.log(CYAN('→ ') + msg);
}

export function warn(msg) {
  console.log(RED('✗ ') + msg);
}

export function completionBanner(config) {
  const { name, emoji, connections = [] } = config;

  console.log('');
  console.log(GREEN('  Setup complete! 🎉'));
  console.log('');
  console.log(BOLD(`  Your assistant: ${name} ${emoji}`));

  const connList = ['Telegram', ...connections];
  console.log(`  Connections: ${connList.join(', ')}`);

  console.log('');
  console.log('  Start each day:');
  console.log(DIM('    ~/Documents/my-assistant/start.sh'));
  console.log('');
  console.log('  Reconfigure anytime:');
  console.log(DIM('    cd ~/Documents/my-assistant'));
  console.log(DIM('    npm run setup'));
  console.log('');
  console.log(DIM('  Questions? Ask your assistant or Alex.'));
  console.log('');
}
