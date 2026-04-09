const ALL_COMMUNICATION_STYLES = [
  'Short, punchy sentences',
  'Conversational and relaxed',
  'Professional but not stiff',
  'Uses occasional humor',
  'Asks clarifying questions before diving in',
  'Gives the answer first, explains after',
  'Uses analogies and examples',
  'Straight to the point, minimal small talk',
];

/**
 * Generates the content of my-identity.md from interview answers.
 *
 * @param {Object} answers
 * @param {string}   answers.name              - Assistant name
 * @param {string}   answers.emoji             - Assistant emoji
 * @param {string}   answers.vibeDescription   - 2-sentence personality blurb
 * @param {string[]} answers.communicationStyle - Selected style options
 * @param {string[]} answers.ucFocus           - Selected UC focus areas
 * @param {string[]} answers.helpWith          - Selected "help with" areas
 * @param {string}   answers.userName          - What to call the user
 * @param {string}   answers.userRole          - User's role description
 * @param {string}   [answers.clients]         - Current clients (optional)
 * @param {string[]} answers.quirks            - 0-2 quirk strings
 * @param {string}   [answers.voiceNotes]      - Extra voice/style notes (optional)
 * @returns {string} Markdown content
 */
export function generateIdentityMd(answers) {
  const {
    name,
    emoji,
    vibeDescription,
    communicationStyle = [],
    ucFocus = [],
    helpWith = [],
    userName,
    userRole,
    clients,
    quirks = [],
    voiceNotes,
  } = answers;

  const styleChecklist = ALL_COMMUNICATION_STYLES.map((item) => {
    const checked = communicationStyle.includes(item) ? 'x' : ' ';
    return `- [${checked}] ${item}`;
  }).join('\n');

  const focusList = helpWith.length > 0
    ? helpWith.map((item) => `- ${item}`).join('\n')
    : '- (no focus areas selected)';

  const quirksList = quirks.filter(Boolean).length > 0
    ? quirks.filter(Boolean).map((q) => `- ${q}`).join('\n')
    : '- (none)';

  const voiceSection = voiceNotes
    ? `\n**Other voice notes:** ${voiceNotes}\n`
    : '';

  const clientsLine = clients
    ? `\n- **Current clients:** ${clients}`
    : '';

  const lines = [
    `# My Assistant's Identity`,
    ``,
    `## Basics`,
    ``,
    `- **Name:** ${name} ${emoji}`,
    `- **Emoji:** ${emoji}`,
    ``,
    `## Personality`,
    ``,
    vibeDescription,
    ``,
    `## Voice & Communication Style`,
    ``,
    styleChecklist,
    voiceSection,
    `## Focus Areas`,
    ``,
    focusList,
    ``,
    `## What To Call You`,
    ``,
    `- **Your name:** ${userName}`,
    `- **Your role:** ${userRole}${clientsLine}`,
    ``,
    `## Quirks`,
    ``,
    quirksList,
  ];

  return lines.join('\n');
}
