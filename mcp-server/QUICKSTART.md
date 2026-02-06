# Quick Start Guide

Get the Hytale MCP Server running in 5 minutes!

## Local Installation (Recommended)

### Step 1: Copy Files to Your Computer

From your Windows machine:
```cmd
mkdir C:\hytale-mcp
scp -r giovanni@MEGALODON:/home/giovanni/scratch/hytale-prefab-generator/mcp-server/* C:\hytale-mcp\
```

### Step 2: Install Dependencies
```cmd
cd C:\hytale-mcp
npm install
```

### Step 3: Verify It Works
```cmd
node src\index.js
```

**Expected output**:
```
✅ Loaded 733 blocks from registry
📂 Data directory: C:\hytale-mcp\data
💾 Prefabs directory: C:\hytale-mcp\prefabs
🚀 Hytale MCP Server running
```

Press Ctrl+C to stop.

### Step 4: Configure Claude Desktop

Edit: `C:\Users\Giovanni\AppData\Roaming\Claude\claude_desktop_config.json`

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

### Step 5: Restart Claude Desktop

Completely quit and restart Claude Desktop.

### Step 6: Test It!

In Claude, ask:
```
List the Hytale block categories
```

or

```
Search for stone blocks in Hytale
```

If Claude responds with actual block data, **it's working!** 🎉

---

## Custom Paths?

If your Hytale assets are in a different location, see [CONFIGURATION.md](CONFIGURATION.md) for how to configure custom paths.

**Quick example** (Windows):
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": ["C:\\hytale-mcp\\src\\index.js"],
      "env": {
        "HYTALE_DATA_DIR": "D:\\HytaleData",
        "HYTALE_PREFAB_DIR": "C:\\Users\\Giovanni\\Documents\\Prefabs"
      }
    }
  }
}
```

---

## Troubleshooting

### "Cannot find module"
```cmd
cd C:\hytale-mcp
npm install
```

### "Failed to load block registry"
Data files missing. Copy them from the remote server:
```cmd
scp giovanni@MEGALODON:/home/giovanni/scratch/hytale-prefab-generator/mcp-server/data/* C:\hytale-mcp\data\
```

### Tools not appearing in Claude
1. Check config file is valid JSON
2. Verify paths use double backslashes (`\\`)
3. Completely restart Claude Desktop
4. Check logs: `%APPDATA%\Claude\logs\`

---

## Next Steps

Once working:

1. ✅ **Generate a test prefab**:
   ```
   Claude, generate a simple 5x5x5 cube of stone blocks as a Hytale prefab
   ```

2. ✅ **Find the generated file**:
   ```
   C:\hytale-mcp\prefabs\<name>.prefab.json
   ```

3. ✅ **Copy to Hytale** (if running locally):
   ```cmd
   copy C:\hytale-mcp\prefabs\my-structure.prefab.json "C:\Users\Giovanni\AppData\Roaming\Hytale\worlds\default\prefabs\"
   ```

4. ✅ **Load in game** and test!

---

## More Info

- **Full setup guide**: [README.md](README.md)
- **Configuration options**: [CONFIGURATION.md](CONFIGURATION.md)
- **Remote setup**: [../REMOTE_SETUP.md](../REMOTE_SETUP.md)
- **Local setup**: [../INSTALL_LOCAL.md](../INSTALL_LOCAL.md)

---

**That's it!** You're ready to generate Hytale prefabs with Claude. 🚀
