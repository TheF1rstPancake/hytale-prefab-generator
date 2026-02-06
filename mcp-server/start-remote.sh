#!/bin/bash
# Wrapper script to start Hytale MCP server
# Ensures proper environment and Node.js is available

# Load Node.js from nvm or system PATH
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
fi

# Navigate to MCP server directory
cd /home/giovanni/scratch/hytale-prefab-generator/mcp-server || exit 1

# Start the server
exec node src/index.js
