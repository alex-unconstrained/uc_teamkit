#!/bin/bash
set -e

GREEN='\033[0;32m'
ORANGE='\033[0;33m'
RED='\033[0;31m'
DIM='\033[2m'
NC='\033[0m'

ok() { echo -e "${GREEN}✓${NC} $1"; }
doing() { echo -e "${ORANGE}→${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; }

echo ""
echo -e "${ORANGE}UnconstrainED AI Assistant — Bootstrapper${NC}"
echo ""

# OS check
if [[ "$OSTYPE" != "darwin"* ]]; then
  fail "This setup is for Mac only. Contact Alex for help with other platforms."
  exit 1
fi
ok "macOS detected"

# Homebrew
if command -v brew &>/dev/null; then
  ok "Homebrew found"
else
  doing "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || true
  ok "Homebrew installed"
fi

# Node.js
if command -v node &>/dev/null; then
  ok "Node.js found ($(node --version))"
else
  doing "Installing Node.js..."
  brew install node
  ok "Node.js installed ($(node --version))"
fi

# Bun
if command -v bun &>/dev/null; then
  ok "Bun found ($(bun --version))"
else
  doing "Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
  ok "Bun installed"
fi

# Claude Code CLI
if command -v claude &>/dev/null; then
  ok "Claude Code CLI found"
else
  doing "Installing Claude Code CLI..."
  if npm install -g @anthropic-ai/claude-code 2>/dev/null; then
    ok "Claude Code CLI installed (global)"
  else
    echo -e "${DIM}  Global install needs admin rights. Installing locally instead...${NC}"
    # Will install as local dep after clone — npx handles the rest
    CLAUDE_LOCAL=true
    ok "Will use local Claude Code (no admin needed)"
  fi
fi

# Git
if command -v git &>/dev/null; then
  ok "Git found"
else
  fail "Git is not installed. Install Xcode Command Line Tools: xcode-select --install"
  exit 1
fi

# Clone repo
DEST="$HOME/Documents/my-assistant"
if [ -d "$DEST" ]; then
  ok "Project directory exists at $DEST"
else
  doing "Cloning project..."
  git clone https://github.com/UnconstrainED-AI/uc-teamkit.git "$DEST"
  ok "Project cloned to $DEST"
fi

# Install dependencies
doing "Installing dependencies..."
cd "$DEST"
npm install --silent
if [ "$CLAUDE_LOCAL" = "true" ]; then
  doing "Installing Claude Code locally..."
  npm install @anthropic-ai/claude-code --silent
  ok "Claude Code installed locally (use npx claude to run)"
fi
ok "Dependencies installed"

# Claude Code auth
echo ""
doing "Checking Claude Code authentication..."
echo -e "${DIM}If you haven't logged in yet, you'll be prompted now.${NC}"
if command -v claude &>/dev/null; then
  claude auth login 2>/dev/null || true
else
  npx @anthropic-ai/claude-code auth login 2>/dev/null || true
fi

# Launch setup
echo ""
echo -e "${GREEN}Prerequisites ready! Launching setup wizard...${NC}"
echo ""
npm run setup
