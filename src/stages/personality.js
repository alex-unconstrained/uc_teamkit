import prompts from 'prompts';
import chalk from 'chalk';
import { generateIdentityMd } from '../generators/identity.js';
import { generateSoulMd } from '../generators/soul.js';
import { section, DIM } from '../utils/display.js';
import { validateNotEmpty } from '../utils/validators.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const EMOJI_OPTIONS = ['🧭', '🔥', '🦉', '🚀', '💡', '🛡️', '🎯', '🌊', '🤖', '⚡', '🧠', '🌿'];

const VIBE_DESCRIPTIONS = {
  direct:
    'Direct and sharp, like a colleague who cuts through the noise. No fluff, no filler — just the answer and the next step.',
  warm:
    'Warm and encouraging, like a supportive teammate who celebrates wins and keeps you motivated. Genuine, not performative.',
  calm:
    'Calm, steady, and precise. Thinks before speaking, asks exactly the right question, and says what needs to be said — nothing more.',
  energetic:
    'Energetic and proactive — always two steps ahead. Brings ideas, flags things before they\'re urgent, and keeps momentum high.',
  witty:
    'Dry wit and understated observations. Makes a point with a well-placed line, not a paragraph. Warm underneath, sharp on the surface.',
};

const COMMUNICATION_STYLES = [
  'Short, punchy sentences',
  'Conversational and relaxed',
  'Professional but not stiff',
  'Uses occasional humor',
  'Asks clarifying questions before diving in',
  'Gives the answer first, explains after',
  'Uses analogies and examples',
  'Straight to the point, minimal small talk',
];

const UC_FOCUS_AREAS = [
  'Course design',
  'Client relations',
  'Product/tool dev',
  'Operations',
  'Marketing',
  'Strategy/biz dev',
];

const HELP_WITH_OPTIONS = [
  'Workshop prep',
  'Course content',
  'Client communication',
  'Research on AI in education',
  'Data analysis',
  'Marketing/newsletter',
  'Internal ops',
  'Tool building',
];

const DEFAULT_COMMUNICATION_RULES = [
  'No filler. Don\'t start responses with "Great question!" or "Absolutely!" — just answer.',
  "Be honest. If you don't know something, say so. If you think I'm wrong, tell me respectfully.",
  'Earn trust through competence. Be reliable, accurate, and thorough. That matters more than being agreeable.',
  'Match my energy. If I send a quick message, respond concisely. If I send something detailed, give it the attention it deserves.',
];

const QUIRK_EXAMPLES = [
  'Ends important suggestions with "just saying" as a subtle nudge',
  'Uses sports analogies when explaining strategy',
  'Calls out when I\'m overcomplicating things',
  'Checks in if I go quiet on a project for too long',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Wraps prompts() and throws if the user cancels (Ctrl+C).
 */
async function ask(questions) {
  const result = await prompts(questions, {
    onCancel: () => {
      console.log('\n' + chalk.dim('Setup cancelled.'));
      process.exit(0);
    },
  });
  return result;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Runs the full personality interview and returns generated markdown content.
 *
 * @returns {Promise<{
 *   identityMd: string,
 *   soulMd: string,
 *   identityAnswers: Object,
 *   soulAnswers: Object,
 * }>}
 */
export async function runPersonalityInterview() {
  // ── Step 1: Design Your Assistant ──────────────────────────────────────────
  section('Step 1: Design Your Assistant');

  // 1. Name
  const { name } = await ask({
    type: 'text',
    name: 'name',
    message: 'What do you want to name your assistant?',
    hint: 'e.g., Atlas, Nova, Scout, Sage',
    validate: (v) => validateNotEmpty(v) || 'Name cannot be empty.',
  });

  // 2. Emoji — preset list + custom
  const emojiChoices = [
    ...EMOJI_OPTIONS.map((e) => ({ title: e, value: e })),
    { title: '✏️  Type your own', value: '__custom__' },
  ];

  const { emojiChoice } = await ask({
    type: 'select',
    name: 'emojiChoice',
    message: `Pick an emoji for ${name}`,
    choices: emojiChoices,
  });

  let emoji = emojiChoice;
  if (emojiChoice === '__custom__') {
    const { customEmoji } = await ask({
      type: 'text',
      name: 'customEmoji',
      message: 'Type your emoji:',
      validate: (v) => validateNotEmpty(v) || 'Emoji cannot be empty.',
    });
    emoji = customEmoji.trim();
  }

  // 3. Vibe
  const vibeChoices = [
    { title: 'Direct', value: 'direct' },
    { title: 'Warm', value: 'warm' },
    { title: 'Calm', value: 'calm' },
    { title: 'Energetic', value: 'energetic' },
    { title: 'Witty', value: 'witty' },
    { title: 'Custom — write my own', value: 'custom' },
  ];

  const { vibeKey } = await ask({
    type: 'select',
    name: 'vibeKey',
    message: `What's ${name}'s overall vibe?`,
    choices: vibeChoices,
  });

  let vibeDescription;
  if (vibeKey === 'custom') {
    const { customVibe } = await ask({
      type: 'text',
      name: 'customVibe',
      message: `Describe ${name}'s personality (2 sentences):`,
      validate: (v) => validateNotEmpty(v) || 'Description cannot be empty.',
    });
    vibeDescription = customVibe.trim();
  } else {
    vibeDescription = VIBE_DESCRIPTIONS[vibeKey];
    console.log(DIM(`  → ${vibeDescription}`));
  }

  // 4. Communication style
  const { communicationStyle } = await ask({
    type: 'multiselect',
    name: 'communicationStyle',
    message: `How does ${name} communicate? (space to select, enter to confirm)`,
    choices: COMMUNICATION_STYLES.map((s) => ({ title: s, value: s })),
    hint: 'Select all that apply',
    instructions: false,
  });

  // 5. UC Focus
  const { ucFocus } = await ask({
    type: 'multiselect',
    name: 'ucFocus',
    message: 'What are your main focus areas at UnconstrainED?',
    choices: UC_FOCUS_AREAS.map((f) => ({ title: f, value: f })),
    hint: 'Select all that apply',
    instructions: false,
  });

  // 6. Help with
  const { helpWith } = await ask({
    type: 'multiselect',
    name: 'helpWith',
    message: `What should ${name} help you with most?`,
    choices: HELP_WITH_OPTIONS.map((h) => ({ title: h, value: h })),
    hint: 'Select all that apply',
    instructions: false,
  });

  // 7. User name
  const { userName } = await ask({
    type: 'text',
    name: 'userName',
    message: 'What should your assistant call you?',
    validate: (v) => validateNotEmpty(v) || 'Name cannot be empty.',
  });

  // 8. User role
  const { userRole } = await ask({
    type: 'text',
    name: 'userRole',
    message: 'What is your role?',
    hint: 'e.g., Course designer, Client lead',
    validate: (v) => validateNotEmpty(v) || 'Role cannot be empty.',
  });

  // 9. Current clients (optional)
  const { clients } = await ask({
    type: 'text',
    name: 'clients',
    message: 'Any current clients your assistant should know about?',
    hint: 'Optional — press enter to skip',
  });

  // 10. Quirk 1 (optional)
  console.log('');
  console.log(DIM('  Quirks give your assistant personality. Some examples:'));
  for (const ex of QUIRK_EXAMPLES) {
    console.log(DIM(`    • ${ex}`));
  }
  console.log('');

  const { quirk1 } = await ask({
    type: 'text',
    name: 'quirk1',
    message: `Give ${name} a quirk (optional):`,
    hint: 'Press enter to skip',
  });

  // 11. Quirk 2 — only if quirk 1 was provided
  let quirk2 = '';
  if (quirk1 && quirk1.trim()) {
    const { q2 } = await ask({
      type: 'text',
      name: 'q2',
      message: `One more quirk? (optional):`,
      hint: 'Press enter to skip',
    });
    quirk2 = q2 || '';
  }

  const quirks = [quirk1, quirk2].filter((q) => q && q.trim());

  // ── Step 2: Your Assistant's Values ────────────────────────────────────────
  section('Step 2: Your Assistant\'s Values');

  // Show default rules before asking
  console.log('');
  console.log(DIM('  Default communication rules:'));
  DEFAULT_COMMUNICATION_RULES.forEach((rule, i) => {
    console.log(DIM(`    ${i + 1}. ${rule}`));
  });
  console.log('');

  // 12. Keep default rules?
  const { keepRules } = await ask({
    type: 'confirm',
    name: 'keepRules',
    message: 'Keep these default communication rules?',
    initial: true,
  });

  // 13. Boundaries (optional)
  const { boundaries } = await ask({
    type: 'text',
    name: 'boundaries',
    message: `Any specific boundaries for ${name}?`,
    hint: 'Optional — e.g., "Don\'t schedule over family dinner" or press enter to skip',
  });

  // 14. Success (optional)
  const { success } = await ask({
    type: 'text',
    name: 'success',
    message: 'What does a great day with your assistant look like?',
    hint: 'Optional — press enter to use defaults',
  });

  // 15. Annoyances (optional)
  const { annoyances } = await ask({
    type: 'text',
    name: 'annoyances',
    message: `What things should ${name} avoid doing?`,
    hint: 'Optional — press enter to use defaults',
  });

  // ── Assemble answers objects ────────────────────────────────────────────────

  const identityAnswers = {
    name,
    emoji,
    vibeDescription,
    communicationStyle: communicationStyle || [],
    ucFocus: ucFocus || [],
    helpWith: helpWith || [],
    userName,
    userRole,
    clients: clients && clients.trim() ? clients.trim() : undefined,
    quirks,
  };

  const soulAnswers = {
    keepRules,
    boundaries: boundaries && boundaries.trim() ? boundaries.trim() : '',
    success: success && success.trim() ? success.trim() : '',
    annoyances: annoyances && annoyances.trim() ? annoyances.trim() : '',
  };

  // ── Generate markdown ───────────────────────────────────────────────────────

  const identityMd = generateIdentityMd(identityAnswers);
  const soulMd = generateSoulMd(soulAnswers);

  return { identityMd, soulMd, identityAnswers, soulAnswers };
}
