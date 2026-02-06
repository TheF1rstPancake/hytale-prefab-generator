# Find Hytale Assets on Windows
# Run this on your Windows machine to locate Hytale installation

$ErrorActionPreference = "SilentlyContinue"

Write-Host "=== Searching for Hytale Installation ===" -ForegroundColor Cyan
Write-Host ""

$searchPaths = @(
    "$env:APPDATA\Hytale",
    "$env:LOCALAPPDATA\Hytale",
    "$env:USERPROFILE\Documents\Hytale",
    "C:\Program Files\Hytale",
    "C:\Program Files (x86)\Hytale",
    "C:\Program Files (x86)\Steam\steamapps\common\Hytale",
    "C:\Games\Hytale",
    "D:\Games\Hytale",
    "E:\Games\Hytale"
)

Write-Host "Checking common locations..." -ForegroundColor Yellow
Write-Host ""

$foundLocations = @()

foreach ($path in $searchPaths) {
    if (Test-Path $path) {
        Write-Host "✓ Found: $path" -ForegroundColor Green
        $foundLocations += $path

        # Check for specific files
        if (Test-Path "$path\Assets.zip") {
            Write-Host "  → Contains Assets.zip" -ForegroundColor Cyan
        }
        if (Test-Path "$path\assets") {
            Write-Host "  → Contains assets\ directory" -ForegroundColor Cyan
        }
        if (Test-Path "$path\worlds") {
            Write-Host "  → Contains worlds\ directory" -ForegroundColor Cyan
        }
        if (Test-Path "$path\prefabs") {
            Write-Host "  → Contains prefabs\ directory" -ForegroundColor Cyan
        }
        Write-Host ""
    }
}

if ($foundLocations.Count -eq 0) {
    Write-Host "No Hytale installations found in common locations." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Try searching manually:" -ForegroundColor Cyan
    Write-Host "  1. Open Windows Explorer" -ForegroundColor Gray
    Write-Host "  2. Search for: Assets.zip" -ForegroundColor Gray
    Write-Host "  3. Filter by: File type = ZIP" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "=== Summary ===" -ForegroundColor Cyan
    Write-Host "Found $($foundLocations.Count) Hytale location(s):" -ForegroundColor Green
    foreach ($loc in $foundLocations) {
        Write-Host "  • $loc" -ForegroundColor White
    }
    Write-Host ""
}

# Search for Assets.zip specifically
Write-Host "Searching for Assets.zip files..." -ForegroundColor Yellow
Write-Host "(This may take a minute)" -ForegroundColor Gray
Write-Host ""

$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Name.Length -eq 1 }

foreach ($drive in $drives) {
    $searchPath = "${drive}:\"
    Write-Host "Searching $searchPath..." -ForegroundColor Gray

    $assetsFiles = Get-ChildItem -Path $searchPath -Filter "Assets.zip" -Recurse -ErrorAction SilentlyContinue -Depth 4 | Select-Object -First 5

    foreach ($file in $assetsFiles) {
        Write-Host "✓ Found Assets.zip: $($file.FullName)" -ForegroundColor Green
        Write-Host "  Size: $([math]::Round($file.Length / 1GB, 2)) GB" -ForegroundColor Cyan
        Write-Host ""
    }
}

Write-Host "=== How to Use ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Once you find Assets.zip, build the registry:" -ForegroundColor White
Write-Host '  cd C:\Users\Giovanni\scratch\hytale-prefab-generator\mcp-server' -ForegroundColor Gray
Write-Host '  node scripts\build-block-registry.js --assets-path "C:\path\to\Assets.zip"' -ForegroundColor Gray
Write-Host ""

Write-Host "Or set environment variable:" -ForegroundColor White
Write-Host '  $env:HYTALE_ASSETS_PATH="C:\path\to\Assets.zip"' -ForegroundColor Gray
Write-Host '  npm run build-registry' -ForegroundColor Gray
Write-Host ""
