import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { section, success, info } from '../utils/display.js';
import { launchClaude } from '../utils/claude.js';
import { generateOrgContext } from '../generators/org-context.js';
import { generateInitialMemory } from '../generators/memory.js';

/**
 * Step 5 of onboarding: gather context about what the user is working on right now.
 * Writes org-context.md, .claude/memory/user_profile.md, and start.sh to the project root.
 *
 * @param {Object} identityAnswers - The full answers object from the identity stage
 * @returns {Object} contextAnswers - { currentWork, workStyle, weekGoal }
 */
export async function runContextGathering(identityAnswers) {
  section('Step 5: Help Your Assistant Hit the Ground Running');

  const contextAnswers = await prompts(
    [
      {
        type: 'text',
        name: 'currentWork',
        message: 'What are you working on right now?',
        hint: 'e.g., Onboarding a new client, finishing a course module, upcoming workshop deadline',
      },
      {
        type: 'text',
        name: 'workStyle',
        message: 'Anything about how you like to work?',
        hint: 'e.g., In meetings 9-12, prefer async, deep work in the afternoons — or leave blank',
      },
      {
        type: 'text',
        name: 'weekGoal',
        message: "What's the one thing you'd love help with this week?",
      },
    ],
    { onCancel: () => process.exit(0) }
  );

  const projectRoot = process.cwd();

  // Write org-context.md to project root
  const orgContextPath = path.join(projectRoot, 'org-context.md');
  await fs.writeFile(orgContextPath, generateOrgContext(), 'utf8');
  success('org-context.md created');

  // Write initial memory to .claude/memory/user_profile.md
  const memoryDir = path.join(projectRoot, '.claude', 'memory');
  await fs.ensureDir(memoryDir);
  const memoryPath = path.join(memoryDir, 'user_profile.md');
  await fs.writeFile(memoryPath, generateInitialMemory(identityAnswers, contextAnswers), 'utf8');
  success('.claude/memory/user_profile.md created');

  // Write start.sh to project root and make it executable
  const startShPath = path.join(projectRoot, 'start.sh');
  const startShContent = `#!/bin/bash
cd ~/Documents/my-assistant
claude --channels plugin:telegram@claude-plugins-official
`;
  await fs.writeFile(startShPath, startShContent, 'utf8');
  await fs.chmod(startShPath, '755');
  success('start.sh created');

  return contextAnswers;
}

/**
 * Final step: ask the user if they want to launch Claude now.
 */
export async function firstLaunch() {
  const { launchNow } = await prompts(
    {
      type: 'confirm',
      name: 'launchNow',
      message: 'Ready to meet your assistant? Launch now?',
      initial: true,
    },
    { onCancel: () => process.exit(0) }
  );

  if (launchNow) {
    info('Launching...');
    const proc = launchClaude({ channels: true });
    await new Promise((resolve) => proc.on('close', resolve));
  } else {
    info(
      'You can start your assistant anytime by running: claude --channels plugin:telegram@claude-plugins-official'
    );
  }
}
