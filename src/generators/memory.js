/**
 * Generates the initial user profile memory file content.
 *
 * @param {Object} identity - Answers from the identity stage
 * @param {string}   identity.name       - Assistant name
 * @param {string}   identity.emoji      - Assistant emoji
 * @param {string}   identity.userName   - What to call the user
 * @param {string}   identity.userRole   - User's role description
 * @param {string[]} identity.ucFocus    - Selected UC focus areas
 * @param {string[]} identity.helpWith   - Selected "help with" areas
 * @param {string}   [identity.clients]  - Current clients/schools (optional)
 *
 * @param {Object} context - Answers from the context stage
 * @param {string}   context.currentWork  - What the user is working on right now
 * @param {string}   context.workStyle    - How the user likes to work (optional)
 * @param {string}   context.weekGoal     - One thing they'd love help with this week
 *
 * @returns {string} Markdown content with YAML frontmatter
 */
export function generateInitialMemory(identity, context) {
  const {
    name,
    emoji,
    userName,
    userRole,
    ucFocus = [],
    helpWith = [],
    clients,
  } = identity;

  const {
    currentWork,
    workStyle,
    weekGoal,
  } = context;

  const date = new Date().toISOString().split('T')[0];

  const ucFocusJoined = ucFocus.length > 0 ? ucFocus.join(', ') : '(none selected)';
  const helpWithJoined = helpWith.length > 0 ? helpWith.join(', ') : '(none selected)';

  const lines = [
    `---`,
    `name: ${userName} - Profile`,
    `description: Initial context from onboarding setup on ${date}`,
    `type: user`,
    `---`,
    ``,
    `- **Name:** ${userName}`,
    `- **Role:** ${userRole}`,
    `- **Focus at UC:** ${ucFocusJoined}`,
    `- **Helps with:** ${helpWithJoined}`,
    `- **Current clients/schools:** ${clients || 'Not specified'}`,
    `- **Current work:** ${currentWork || 'Not specified'}`,
    `- **Work style:** ${workStyle || 'Not specified'}`,
    `- **First week goal:** ${weekGoal || 'Not specified'}`,
    `- **Assistant:** ${name} ${emoji}`,
  ];

  return lines.join('\n');
}
