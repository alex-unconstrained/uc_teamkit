// Each rule has a short bold keyword and the full descriptive sentence.
const DEFAULT_COMMUNICATION_RULES = [
  {
    label: 'No filler',
    detail: 'Don\'t start responses with "Great question!" or "Absolutely!" — just answer.',
  },
  {
    label: 'Be honest',
    detail: "If you don't know something, say so. If you think I'm wrong, tell me respectfully.",
  },
  {
    label: 'Earn trust through competence',
    detail: 'Be reliable, accurate, and thorough. That matters more than being agreeable.',
  },
  {
    label: 'Match my energy',
    detail: 'If I send a quick message, respond concisely. If I send something detailed, give it the attention it deserves.',
  },
];

const DEFAULT_BOUNDARY =
  'Check with the team before making external commitments on behalf of UnconstrainED.';

const DEFAULT_SUCCESS = [
  'I open my day and there is a clear summary of what needs my attention.',
  'When I ask for research, I get actionable insights, not summaries.',
  'My assistant catches things I would miss and brings them up proactively.',
];

const DEFAULT_ANNOYANCES = [
  'Having to ask for the same thing twice.',
  'Over-explaining simple things.',
  'Being too cautious or hedging every statement.',
  'Corporate buzzwords and jargon.',
];

/**
 * Generates the content of my-soul.md from interview answers.
 *
 * @param {Object}  answers
 * @param {boolean} answers.keepRules    - Whether to include the 4 default communication rules
 * @param {string}  [answers.boundaries] - User-provided boundary text (optional)
 * @param {string}  [answers.success]    - What success looks like (optional)
 * @param {string}  [answers.annoyances] - Things that annoy the user (optional)
 * @returns {string} Markdown content
 */
export function generateSoulMd(answers) {
  const {
    keepRules = true,
    boundaries,
    success,
    annoyances,
  } = answers;

  // Communication rules section
  const rulesSection = keepRules
    ? DEFAULT_COMMUNICATION_RULES.map((r, i) => `${i + 1}. **${r.label}.** ${r.detail}`).join('\n')
    : '1. (customize your own communication rules here)';

  // Boundaries — always include the default pre-seed, plus user additions
  const boundaryLines = [DEFAULT_BOUNDARY];
  if (boundaries && boundaries.trim()) {
    // Support multi-line / comma-separated entries
    const extra = boundaries
      .split(/\n|,(?=\s)/)
      .map((b) => b.trim())
      .filter(Boolean);
    boundaryLines.push(...extra);
  }
  const boundariesSection = boundaryLines.map((b) => `- ${b}`).join('\n');

  // Success
  const successLines = success && success.trim()
    ? success.split(/\n/).map((s) => s.trim()).filter(Boolean).map((s) => `- ${s}`)
    : DEFAULT_SUCCESS.map((s) => `- ${s}`);
  const successSection = successLines.join('\n');

  // Annoyances
  const annoyanceLines = annoyances && annoyances.trim()
    ? annoyances.split(/\n/).map((a) => a.trim()).filter(Boolean).map((a) => `- ${a}`)
    : DEFAULT_ANNOYANCES.map((a) => `- ${a}`);
  const annoyancesSection = annoyanceLines.join('\n');

  const lines = [
    `# My Assistant's Values & Rules`,
    ``,
    `## Communication Rules`,
    ``,
    rulesSection,
    ``,
    `## Boundaries`,
    ``,
    boundariesSection,
    ``,
    `## What Success Looks Like`,
    ``,
    successSection,
    ``,
    `## Things That Annoy Me`,
    ``,
    annoyancesSection,
  ];

  return lines.join('\n');
}
