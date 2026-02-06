# Install MCP Server Locally (Windows)

This guide walks through installing the Hytale MCP server on your local Windows machine instead of running it remotely via SSH.

## Why Local is Better

✅ No SSH issues or complexity
✅ Faster (no network latency)
✅ Easier debugging
✅ Works offline after setup

## Prerequisites

- Node.js 18+ installed on Windows
- Access to the remote machine to copy files (one-time)

## Installation Steps

### 1. Copy Files from Remote to Local

From your Windows machine, run PowerShell or Command Prompt:

```powershell
# Create local directory
mkdir C:\hytale-mcp
cd C:\hytale-mcp

# Copy the entire MCP server directory
scp -r giovanni@MEGALODON:/home/giovanni/scratch/hytale-prefab-generator/mcp-server/* .
```

This copies:
- `src/` - MCP server code
- `data/` - Block registry (733 blocks)
- `scripts/` - Build scripts
- `package.json` - Dependencies

### 2. Install Dependencies

```cmd
cd C:\hytale-mcp
npm install
```

### 3. Test the Server

```cmd
node src\index.js
```

**Expected output**:
```
✅ Loaded 733 blocks from registry
🚀 Hytale MCP Server running
```

Press **Ctrl+C** to stop.

If you see this, the server works! 🎉

### 4. Configure Claude Desktop

Open your Claude config file:

**Location**: `C:\Users\Giovanni\AppData\Roaming\Claude\claude_desktop_config.json`

**Add this**:
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": [
        "C:\\hytale-mcp\\src\\index.js"
      ]
    }
  }
}
```

**Important**: Use double backslashes `\\` in Windows paths!

### 5. Restart Claude Desktop

1. Completely quit Claude Desktop (check system tray)
2. Start Claude Desktop again
3. Wait for it to fully initialize

### 6. Test in Claude

Open Claude Desktop and ask:

```
List the Hytale block categories
```

or

```
Search for stone blocks in Hytale
```

If Claude responds with actual Hytale block data, it's working! 🚀

## Troubleshooting

### "Cannot find module '@modelcontextprotocol/sdk'"

**Fix**: Install dependencies:
```cmd
cd C:\hytale-mcp
npm install
```

### "ENOENT: no such file or directory, open 'block-registry.json'"

**Fix**: Verify the data files were copied:
```cmd
dir C:\hytale-mcp\data
```

Should show:
- `block-registry.json`
- `categories.json`
- `textures.json`

If missing, copy again:
```cmd
scp giovanni@MEGALODON:/home/giovanni/scratch/hytale-prefab-generator/mcp-server/data/* C:\hytale-mcp\data\
```

### Tools Not Appearing in Claude

1. Check config syntax (must be valid JSON)
2. Verify file paths are correct (use full paths with `\\`)
3. Completely restart Claude Desktop
4. Check Claude logs: `%APPDATA%\Claude\logs\`

### "node: command not found"

**Fix**: Install Node.js from [nodejs.org](https://nodejs.org/)

Or specify full path to node in Claude config:
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": [
        "C:\\hytale-mcp\\src\\index.js"
      ]
    }
  }
}
```

## File Structure After Install

```
C:\hytale-mcp\
├── src\
│   └── index.js           # MCP server
├── data\
│   ├── block-registry.json (733 blocks)
│   ├── categories.json
│   └── textures.json
├── scripts\
│   └── build-block-registry.js
├── prefabs\               # Generated prefabs saved here
├── package.json
└── node_modules\          # After npm install
```

## Next Steps

Once working:

1. ✅ Generate test prefabs with Claude
2. ✅ Use validation tools
3. 🔜 Copy generated prefabs to Hytale
4. 🔜 Build local preview app

## Copying Prefabs to Hytale

After Claude generates a prefab, you'll find it in:
```
C:\hytale-mcp\prefabs\<name>.prefab.json
```

Copy to Hytale on the remote server:
```cmd
scp C:\hytale-mcp\prefabs\my-structure.prefab.json giovanni@MEGALODON:/home/hytale/server/Server/universe/worlds/default/prefabs/
```

Or if Hytale is local:
```cmd
copy C:\hytale-mcp\prefabs\*.prefab.json "C:\Users\Giovanni\AppData\Roaming\Hytale\worlds\default\prefabs\"
```

## Optional: Extract Textures Locally (For Preview App)

If you want to render prefabs locally later:

### 1. Copy Assets.zip
```cmd
scp giovanni@MEGALODON:/home/hytale/server/Assets.zip C:\hytale-assets\
```

### 2. Update build script path

Edit `C:\hytale-mcp\scripts\build-block-registry.js`:

Change:
```javascript
const HYTALE_ASSETS_ZIP = '/home/hytale/server/Assets.zip';
```

To:
```javascript
const HYTALE_ASSETS_ZIP = 'C:\\hytale-assets\\Assets.zip';
```

### 3. Rebuild registry (optional)
```cmd
npm run build-registry
```

But this is **not needed** for basic prefab generation!

## Success Indicators

✅ **Working if you see**:
- Server starts without errors locally
- Claude Desktop shows MCP server connected
- Claude can search and list Hytale blocks
- Prefabs are saved to `C:\hytale-mcp\prefabs\`

## Benefits of Local Setup

| Feature | Remote (SSH) | Local (Windows) |
|---------|--------------|-----------------|
| Setup complexity | ❌ High | ✅ Simple |
| SSH issues | ❌ Yes | ✅ None |
| Network required | ❌ Yes | ✅ No (after setup) |
| Debugging | ❌ Hard | ✅ Easy |
| Performance | ⚠️ Network latency | ✅ Instant |
| Prefab access | ❌ Need to copy | ✅ Local files |

## Summary

Local installation is **much simpler** and works great because:
- MCP server just provides block data to Claude
- Doesn't need running Hytale server
- All data is static (block registry)
- Generated prefabs are just JSON files

The only remote interaction needed is copying the final `.prefab.json` files to wherever Hytale loads them from!
