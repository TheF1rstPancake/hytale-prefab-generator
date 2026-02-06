# Remote MCP Server Setup Guide

This guide explains how to connect Claude Desktop (running locally on Windows) to the Hytale MCP server (running on a remote Linux machine).

## Architecture

```
┌─────────────────────────────┐
│  Your Local Windows PC      │
│                             │
│  ┌───────────────────────┐  │
│  │  Claude Desktop       │  │
│  │  (MCP Client)         │  │
│  └───────────┬───────────┘  │
│              │ SSH          │
└──────────────┼──────────────┘
               │
               │ ssh -T giovanni@MEGALODON
               │
┌──────────────▼──────────────┐
│  Remote Linux Machine       │
│  (MEGALODON)                │
│                             │
│  ┌───────────────────────┐  │
│  │  Hytale MCP Server    │  │
│  │  (/home/giovanni/.../ │  │
│  │   mcp-server/)        │  │
│  │                       │  │
│  │  ✓ Block registry     │  │
│  │  ✓ Hytale assets      │  │
│  │  ✓ Prefab tools       │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

## Setup Steps

### 1. Verify SSH Access

On your **local Windows machine**, test SSH connection:

```cmd
ssh giovanni@MEGALODON whoami
```

Should output: `giovanni`

### 2. Test MCP Server Remotely

Test that the server starts over SSH:

```cmd
ssh -T giovanni@MEGALODON /home/giovanni/scratch/hytale-prefab-generator/mcp-server/start-remote.sh
```

**Expected output**:
```
✅ Loaded 733 blocks from registry
🚀 Hytale MCP Server running
```

Press **Ctrl+C** to stop.

**If you see an error**, run the debug script:
```cmd
ssh giovanni@MEGALODON /home/giovanni/scratch/hytale-prefab-generator/mcp-server/debug-mcp.sh
ssh giovanni@MEGALODON cat /tmp/hytale-mcp-debug.log
```

### 3. Configure Claude Desktop

On your **local Windows machine**, open the Claude config file:

**Location**: `%APPDATA%\Claude\claude_desktop_config.json`

**Full path**: `C:\Users\Giovanni\AppData\Roaming\Claude\claude_desktop_config.json`

**Configuration**:
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "ssh",
      "args": [
        "-T",
        "giovanni@MEGALODON",
        "/home/giovanni/scratch/hytale-prefab-generator/mcp-server/start-remote.sh"
      ]
    }
  }
}
```

**Important flags**:
- `-T`: Disables pseudo-terminal allocation (critical for MCP stdio communication)

### 4. Restart Claude Desktop

1. Completely quit Claude Desktop (check system tray)
2. Start Claude Desktop again
3. Wait for it to fully load

### 5. Test in Claude

Open a new conversation in Claude and ask:

```
List the Hytale block categories
```

or

```
Search for stone blocks in Hytale
```

If the tools are working, Claude will respond with actual Hytale block data!

## Troubleshooting

### Issue 1: "Server disconnected"

**Symptom**: Logs show "Server transport closed unexpectedly"

**Causes**:
- Node.js not found in SSH PATH
- Server script has errors
- Wrong working directory

**Fix**:
1. Run debug script to see actual error:
   ```cmd
   ssh giovanni@MEGALODON /home/giovanni/scratch/hytale-prefab-generator/mcp-server/debug-mcp.sh
   ssh giovanni@MEGALODON cat /tmp/hytale-mcp-debug.log
   ```

2. Check Node.js is available:
   ```cmd
   ssh giovanni@MEGALODON "node --version"
   ```

3. Verify files exist:
   ```cmd
   ssh giovanni@MEGALODON "ls -la /home/giovanni/scratch/hytale-prefab-generator/mcp-server/"
   ```

### Issue 2: "Module not found"

**Symptom**: Error about missing `@modelcontextprotocol/sdk`

**Fix**: Install dependencies on the remote machine:
```bash
# On remote machine
cd /home/giovanni/scratch/hytale-prefab-generator/mcp-server
npm install
```

### Issue 3: "Permission denied"

**Symptom**: SSH key or script execution errors

**Fix**:
1. Ensure scripts are executable:
   ```bash
   # On remote machine
   chmod +x /home/giovanni/scratch/hytale-prefab-generator/mcp-server/*.sh
   ```

2. Test SSH key authentication works:
   ```cmd
   ssh giovanni@MEGALODON echo "Connected"
   ```

### Issue 4: "Block registry not found"

**Symptom**: Error loading `block-registry.json`

**Fix**: Build the registry:
```bash
# On remote machine
cd /home/giovanni/scratch/hytale-prefab-generator/mcp-server
npm run build-registry
```

### Issue 5: Tools not appearing in Claude

**Symptoms**:
- Claude says "I don't have access to those tools"
- MCP server icon not showing in Claude

**Fixes**:
1. Check config file syntax (must be valid JSON):
   ```cmd
   type "%APPDATA%\Claude\claude_desktop_config.json"
   ```

2. Look for Claude Desktop logs:
   - Windows: `%APPDATA%\Claude\logs\`
   - Check for MCP connection errors

3. Verify server is in Claude's settings:
   - Open Claude Desktop
   - Click Settings → Developer → MCP Servers
   - Should see "hytale-prefab-generator"

4. Restart Claude Desktop completely:
   - Right-click system tray icon → Quit
   - Start again

## Checking Logs

### Claude Desktop Logs (Windows)

Location: `%APPDATA%\Claude\logs\`

View most recent log:
```cmd
type "%APPDATA%\Claude\logs\mcp-*.log" | more
```

### MCP Server Logs (Remote)

Use the debug script:
```cmd
ssh giovanni@MEGALODON /home/giovanni/scratch/hytale-prefab-generator/mcp-server/debug-mcp.sh
ssh giovanni@MEGALODON cat /tmp/hytale-mcp-debug.log
```

## Testing Tools Manually

Once connected, test each tool:

### 1. Search blocks
```
Search for "oak wood" in Hytale blocks
```

### 2. Get categories
```
What Hytale block categories are available?
```

### 3. Get specific block
```
Get info for the Hytale block "Rock_Stone_Brick"
```

### 4. Generate a test prefab
```
Generate a simple 3x3x3 cube of stone blocks as a Hytale prefab
```

### 5. Validate prefab
```
Validate this Hytale prefab: {
  "version": 8,
  "blockIdVersion": 10,
  "anchorX": 0,
  "anchorY": 0,
  "anchorZ": 0,
  "blocks": [
    {"x": 0, "y": 0, "z": 0, "name": "Rock_Stone"}
  ]
}
```

## Advanced: SSH Config

For cleaner config, create an SSH alias:

**Windows**: `%USERPROFILE%\.ssh\config`

```
Host hytale-mcp
    HostName MEGALODON
    User giovanni
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Then simplify Claude config:
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "ssh",
      "args": [
        "-T",
        "hytale-mcp",
        "/home/giovanni/scratch/hytale-prefab-generator/mcp-server/start-remote.sh"
      ]
    }
  }
}
```

## Alternative: Local Installation

If SSH continues to have issues, you can run the MCP server locally:

1. **Mount remote filesystem** (using SSHFS or similar)
2. **Copy files locally**:
   ```cmd
   scp -r giovanni@MEGALODON:/home/giovanni/scratch/hytale-prefab-generator/mcp-server C:\hytale-mcp
   scp -r giovanni@MEGALODON:/home/hytale/server/Assets.zip C:\hytale-assets\
   ```

3. **Update paths** in `build-block-registry.js`:
   ```javascript
   const HYTALE_ASSETS_ZIP = 'C:\\hytale-assets\\Assets.zip';
   ```

4. **Run locally** in Claude config:
   ```json
   {
     "mcpServers": {
       "hytale-prefab-generator": {
         "command": "node",
         "args": ["C:\\hytale-mcp\\src\\index.js"]
       }
     }
   }
   ```

## Success Indicators

✅ **MCP server is working if you see**:
- Server icon in Claude Desktop status bar
- Tools appear when you ask about Hytale blocks
- Claude can search and list actual block names
- Prefabs are saved to the remote server

❌ **Not working if**:
- "I don't have access to those tools"
- "Server disconnected" in logs
- Claude can't find block information

## Next Steps

Once the MCP server is connected and working:

1. ✅ Generate test prefabs with Claude
2. ✅ Validate prefab structure
3. 🔜 Build web preview app (visualize prefabs in 3D)
4. 🔜 Test loading prefabs in Hytale
5. 🔜 Iterate on designs

## Getting Help

If you're still stuck:

1. Collect debug info:
   ```cmd
   ssh giovanni@MEGALODON /home/giovanni/scratch/hytale-prefab-generator/mcp-server/debug-mcp.sh
   ssh giovanni@MEGALODON cat /tmp/hytale-mcp-debug.log
   ```

2. Check Claude Desktop logs:
   ```cmd
   type "%APPDATA%\Claude\logs\mcp-*.log"
   ```

3. Verify remote server status:
   ```cmd
   ssh giovanni@MEGALODON "cd /home/giovanni/scratch/hytale-prefab-generator/mcp-server && npm run start"
   ```
   (Press Ctrl+C after seeing "Server running")
