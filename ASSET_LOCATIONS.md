# Hytale Asset Locations

This document lists where Hytale stores `Assets.zip` in different installation scenarios.

## Single-Player Installation

### Windows
**Default location** (confirmed):
```
C:\Users\<USERNAME>\AppData\Roaming\Hytale\install\release\package\game\Assets.zip
```

**Alternative locations** (check if not found):
```
C:\Users\<USERNAME>\AppData\Local\Hytale\install\release\package\game\Assets.zip
C:\Program Files\Hytale\Assets.zip
C:\Program Files (x86)\Hytale\Assets.zip
```

### macOS
```
~/Library/Application Support/Hytale/install/release/package/game/Assets.zip
```

### Linux
```
~/.local/share/Hytale/install/release/package/game/Assets.zip
```

## Server Installation

### Linux (Dedicated Server)
**Default location**:
```
/home/hytale/server/Assets.zip
/opt/hytale/server/Assets.zip
```

### Windows (Dedicated Server)
```
C:\hytale\server\Assets.zip
D:\hytale\server\Assets.zip
```

## Auto-Detection

The build script (`scripts/build-block-registry.js`) automatically searches these locations in order:

1. **Command-line argument** (`--assets-path`)
2. **Environment variable** (`HYTALE_ASSETS_PATH`)
3. **Auto-detection** (searches common paths)
4. **Default fallback** (`/home/hytale/server/Assets.zip`)

### Auto-detection search order:

1. Linux/Mac server: `/home/hytale/server/Assets.zip`, `/opt/hytale/server/Assets.zip`
2. **Windows single-player**: `%APPDATA%\Hytale\install\release\package\game\Assets.zip`
3. Windows single-player (alt): `%LOCALAPPDATA%\Hytale\install\release\package\game\Assets.zip`
4. Windows server: `C:\hytale\server\Assets.zip`, `D:\hytale\server\Assets.zip`
5. Windows install: `C:\Program Files\Hytale\Assets.zip`, `C:\Program Files (x86)\Hytale\Assets.zip`
6. Windows custom: `C:\Games\Hytale\Assets.zip`

## Usage Examples

### With auto-detection (recommended)
```bash
# Just run it - will auto-detect
npm run build-registry
```

**Output when auto-detected**:
```
✓ Auto-detected Assets.zip at: C:\Users\Giovanni\AppData\Roaming\Hytale\install\release\package\game\Assets.zip
```

### Specify manually
```bash
# Windows
node scripts\build-block-registry.js --assets-path "C:\Users\Giovanni\AppData\Roaming\Hytale\install\release\package\game\Assets.zip"

# Linux/Mac
node scripts/build-block-registry.js --assets-path "/home/hytale/server/Assets.zip"
```

### Using environment variable
```bash
# Windows (PowerShell)
$env:HYTALE_ASSETS_PATH="C:\Users\Giovanni\AppData\Roaming\Hytale\install\release\package\game\Assets.zip"
npm run build-registry

# Windows (Command Prompt)
set HYTALE_ASSETS_PATH=C:\Users\Giovanni\AppData\Roaming\Hytale\install\release\package\game\Assets.zip
npm run build-registry

# Linux/Mac
export HYTALE_ASSETS_PATH=/home/hytale/server/Assets.zip
npm run build-registry
```

## Finding Assets.zip on Your System

### Windows
Use the provided PowerShell script:
```powershell
powershell -ExecutionPolicy Bypass -File find-hytale-assets.ps1
```

Or search manually:
1. Press **Win + E** to open File Explorer
2. Navigate to `%APPDATA%` (paste in address bar)
3. Go to: `Hytale\install\release\package\game\`
4. Look for `Assets.zip`

### Manual Search (All Platforms)
Search for filename: `Assets.zip`

Filter by:
- File type: ZIP
- Size: ~3-4 GB

## Notes

### Single-Player vs Server
- **Same format**: Both use `Assets.zip` with identical structure
- **Same blocks**: Block registry is identical between versions
- **Different paths**: Installation locations differ

### Why Auto-Detection?
Makes setup easier for users:
- ✅ No need to find Assets.zip manually (most of the time)
- ✅ Works for both single-player and server
- ✅ Cross-platform support
- ✅ Can still override if needed

### When Auto-Detection Fails
If the script can't find Assets.zip automatically:
1. Use the PowerShell search script: `find-hytale-assets.ps1`
2. Manually search your computer for `Assets.zip`
3. Specify the path with `--assets-path`

### Steam Installation
If Hytale is installed via Steam, check:
```
C:\Program Files (x86)\Steam\steamapps\common\Hytale\Assets.zip
```

## Troubleshooting

### "Assets file not found"
**Problem**: Script can't locate Assets.zip

**Solution**:
1. Check if Hytale is installed
2. Run the search script: `powershell -ExecutionPolicy Bypass -File find-hytale-assets.ps1`
3. Manually specify path: `--assets-path "path\to\Assets.zip"`

### Multiple Installations Found
If you have both single-player and server installed:
- Auto-detection will use the first one found
- To use a specific installation, specify with `--assets-path`

### Custom Installation Directory
If you installed Hytale to a custom location:
- Use `--assets-path` to specify the exact path
- Consider setting `HYTALE_ASSETS_PATH` environment variable

## Developer Notes

### Priority Order (Implementation)
```javascript
const HYTALE_ASSETS_ZIP =
  assetsPath ||                    // CLI argument (highest priority)
  process.env.HYTALE_ASSETS_PATH || // Environment variable
  findAssetsZip() ||                // Auto-detection
  '/home/hytale/server/Assets.zip'; // Default fallback (Linux server)
```

### Adding New Search Paths
To add a new search path, edit `scripts/build-block-registry.js`:
```javascript
function findAssetsZip() {
  const searchPaths = [
    // Add your path here
    'C:\\YourCustomPath\\Assets.zip',
    // ...existing paths
  ];
  // ...
}
```

### Cross-Platform Compatibility
- Uses `path.join()` for path construction
- Checks `process.env.APPDATA` and `process.env.LOCALAPPDATA` for Windows
- Filters out `null`/`undefined` paths with `.filter(Boolean)`
- Works on Windows, macOS, and Linux

---

**Last Updated**: 2026-02-05
**Confirmed Single-Player Path**: `%APPDATA%\Hytale\install\release\package\game\Assets.zip` (Windows)
