#!/bin/bash
# Debug script for MCP server issues
# Logs all output to help diagnose problems

LOG_FILE="/tmp/hytale-mcp-debug.log"

echo "=== MCP Server Debug Log ===" > "$LOG_FILE"
echo "Started at: $(date)" >> "$LOG_FILE"
echo "User: $(whoami)" >> "$LOG_FILE"
echo "Working dir: $(pwd)" >> "$LOG_FILE"
echo "Node version: $(node --version 2>&1)" >> "$LOG_FILE"
echo "Node path: $(which node 2>&1)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Load Node.js if needed
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "Loading nvm..." >> "$LOG_FILE"
    source "$HOME/.nvm/nvm.sh" 2>> "$LOG_FILE"
fi

# Navigate to directory
cd /home/giovanni/scratch/hytale-prefab-generator/mcp-server || {
    echo "ERROR: Could not cd to mcp-server directory" >> "$LOG_FILE"
    exit 1
}

echo "Starting server..." >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Run server, log everything
node src/index.js 2>> "$LOG_FILE"
EXIT_CODE=$?

echo "" >> "$LOG_FILE"
echo "Server exited with code: $EXIT_CODE" >> "$LOG_FILE"
echo "Ended at: $(date)" >> "$LOG_FILE"

exit $EXIT_CODE
