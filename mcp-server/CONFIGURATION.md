# Configuration Guide

The Hytale MCP Server supports flexible configuration for different installation paths and environments.

## Environment Variables

### `HYTALE_DATA_DIR`

**Purpose**: Specify where the block registry data is located.

**Default**: `../data` (relative to the server's `src/` directory)

**Usage**:
```bash
# Linux/Mac
export HYTALE_DATA_DIR=/path/to/data
node src/index.js

# Windows (Command Prompt)
set HYTALE_DATA_DIR=C:\hytale-data
node src\index.js

# Windows (PowerShell)
$env:HYTALE_DATA_DIR="C:\hytale-data"
node src\index.js
```

**Claude Desktop Config** (with environment variable):
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": ["C:\\hytale-mcp\\src\\index.js"],
      "env": {
        "HYTALE_DATA_DIR": "C:\\hytale-data"
      }
    }
  }
}
```

### `HYTALE_PREFAB_DIR`

**Purpose**: Specify where generated prefabs should be saved.

**Default**: `../prefabs` (relative to the server's `src/` directory)

**Usage**:
```bash
# Linux/Mac
export HYTALE_PREFAB_DIR=/path/to/prefabs
node src/index.js

# Windows
set HYTALE_PREFAB_DIR=C:\Users\Giovanni\Documents\HytalePrefabs
node src\index.js
```

**Claude Desktop Config** (custom prefab directory):
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": ["C:\\hytale-mcp\\src\\index.js"],
      "env": {
        "HYTALE_PREFAB_DIR": "C:\\Users\\Giovanni\\Documents\\HytalePrefabs"
      }
    }
  }
}
```

### `HYTALE_ASSETS_PATH`

**Purpose**: Specify where Hytale's `Assets.zip` file is located (only used by the build script).

**Default**: `/home/hytale/server/Assets.zip`

**Usage**:
```bash
# Linux/Mac
export HYTALE_ASSETS_PATH=/opt/hytale/Assets.zip
npm run build-registry

# Windows
set HYTALE_ASSETS_PATH=C:\HytaleServer\Assets.zip
npm run build-registry
```

## Command-Line Arguments

### Build Registry Script

The `build-block-registry.js` script supports command-line arguments:

```bash
node scripts/build-block-registry.js --assets-path /path/to/Assets.zip
```

**Options**:
- `--assets-path <path>`: Path to `Assets.zip`
- `--help`: Show help message

**Examples**:
```bash
# Linux
node scripts/build-block-registry.js --assets-path /opt/hytale/server/Assets.zip

# Windows
node scripts\build-block-registry.js --assets-path "C:\HytaleServer\Assets.zip"

# With npm script
npm run build-registry -- --assets-path /path/to/Assets.zip
```

## Common Configuration Scenarios

### Scenario 1: Default Local Installation (Windows)

**Setup**:
```
C:\hytale-mcp\
├── data\
│   └── block-registry.json
├── prefabs\
└── src\
    └── index.js
```

**Claude Config**:
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

No environment variables needed - uses defaults!

### Scenario 2: Custom Data Location

**Setup**: Data extracted to a different location (e.g., network drive)

```
D:\HytaleData\
├── block-registry.json
└── categories.json
```

**Claude Config**:
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": ["C:\\hytale-mcp\\src\\index.js"],
      "env": {
        "HYTALE_DATA_DIR": "D:\\HytaleData"
      }
    }
  }
}
```

### Scenario 3: Save Prefabs Directly to Hytale

**Setup**: Save generated prefabs directly to Hytale's prefab folder

**Windows Hytale Location**:
```
C:\Users\Giovanni\AppData\Roaming\Hytale\worlds\default\prefabs\
```

**Claude Config**:
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": ["C:\\hytale-mcp\\src\\index.js"],
      "env": {
        "HYTALE_PREFAB_DIR": "C:\\Users\\Giovanni\\AppData\\Roaming\\Hytale\\worlds\\default\\prefabs"
      }
    }
  }
}
```

### Scenario 4: Remote Assets (via Network Mount)

**Setup**: Assets.zip is on a remote server, mounted locally

```bash
# Mount remote assets
sshfs giovanni@MEGALODON:/home/hytale/server /mnt/hytale

# Build registry with remote path
HYTALE_ASSETS_PATH=/mnt/hytale/Assets.zip npm run build-registry
```

### Scenario 5: Multiple Hytale Versions

**Setup**: Different data directories for different game versions

**Directory structure**:
```
C:\hytale-data\
├── v1.0\
│   ├── block-registry.json
│   └── categories.json
└── v1.1\
    ├── block-registry.json
    └── categories.json
```

**Claude Config** (for v1.1):
```json
{
  "mcpServers": {
    "hytale-prefab-generator-v1.1": {
      "command": "node",
      "args": ["C:\\hytale-mcp\\src\\index.js"],
      "env": {
        "HYTALE_DATA_DIR": "C:\\hytale-data\\v1.1"
      }
    }
  }
}
```

## Troubleshooting

### "Failed to load block registry"

**Problem**: Server can't find `block-registry.json`

**Solutions**:

1. Check if data directory exists:
   ```bash
   ls -la C:\hytale-mcp\data\
   ```

2. Verify `HYTALE_DATA_DIR` is set correctly:
   ```bash
   echo $env:HYTALE_DATA_DIR  # PowerShell
   echo %HYTALE_DATA_DIR%     # Command Prompt
   ```

3. Build the registry if missing:
   ```bash
   npm run build-registry
   ```

4. Check server logs for actual path being used:
   ```bash
   node src\index.js
   # Look for: "📂 Data directory: ..."
   ```

### "Assets file not found"

**Problem**: Build script can't find `Assets.zip`

**Solutions**:

1. Specify the correct path:
   ```bash
   node scripts\build-block-registry.js --assets-path "C:\path\to\Assets.zip"
   ```

2. Or set environment variable:
   ```bash
   set HYTALE_ASSETS_PATH=C:\path\to\Assets.zip
   npm run build-registry
   ```

3. Verify file exists:
   ```bash
   dir C:\path\to\Assets.zip
   ```

### "Permission denied" when saving prefabs

**Problem**: Server can't write to prefab directory

**Solutions**:

1. Check directory exists and is writable:
   ```bash
   mkdir C:\hytale-mcp\prefabs
   ```

2. Use a different directory:
   ```json
   {
     "env": {
       "HYTALE_PREFAB_DIR": "C:\\Users\\Giovanni\\Documents\\Prefabs"
     }
   }
   ```

3. Check Windows permissions on the directory

## Priority Order

When multiple configuration methods are used, they are prioritized as follows:

### For Assets Path (Build Script):
1. Command-line argument `--assets-path`
2. Environment variable `HYTALE_ASSETS_PATH`
3. Default: `/home/hytale/server/Assets.zip`

### For Data Directory (MCP Server):
1. Environment variable `HYTALE_DATA_DIR`
2. Default: `../data` (relative to `src/`)

### For Prefab Directory (MCP Server):
1. Environment variable `HYTALE_PREFAB_DIR`
2. Default: `../prefabs` (relative to `src/`)

## Best Practices

1. **Use absolute paths** in environment variables to avoid confusion
2. **Use double backslashes** (`\\`) in Windows paths within JSON
3. **Test configuration** by running the server manually first
4. **Keep data and prefabs separate** for easier backup/management
5. **Document your setup** if using non-default paths

## Testing Your Configuration

Before configuring Claude Desktop, test the server manually:

```bash
# Set your environment variables
set HYTALE_DATA_DIR=C:\my-data
set HYTALE_PREFAB_DIR=C:\my-prefabs

# Run the server
node src\index.js

# Check the output:
# ✅ Loaded 733 blocks from registry
# 📂 Data directory: C:\my-data
# 💾 Prefabs directory: C:\my-prefabs
# 🚀 Hytale MCP Server running
```

If you see all these messages, your configuration is correct!
