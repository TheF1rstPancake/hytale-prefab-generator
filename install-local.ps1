# Hytale MCP Server - Local Installation Script for Windows
# Run this on your local Windows machine

$ErrorActionPreference = "Stop"

Write-Host "=== Hytale MCP Server - Local Installation ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$RemoteHost = "giovanni@MEGALODON"
$RemotePath = "/home/giovanni/scratch/hytale-prefab-generator/mcp-server"
$LocalPath = "C:\hytale-mcp"
$ClaudeConfigPath = "$env:APPDATA\Claude\claude_desktop_config.json"

# Step 1: Check prerequisites
Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Yellow

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if SSH is available
try {
    $sshVersion = ssh -V 2>&1
    Write-Host "  ✓ SSH found" -ForegroundColor Green
} catch {
    Write-Host "  ✗ SSH not found. Please enable OpenSSH client in Windows Features." -ForegroundColor Red
    exit 1
}

# Check if SCP is available
try {
    $null = Get-Command scp -ErrorAction Stop
    Write-Host "  ✓ SCP found" -ForegroundColor Green
} catch {
    Write-Host "  ✗ SCP not found. Please enable OpenSSH client in Windows Features." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Test remote connection
Write-Host "Step 2: Testing remote connection..." -ForegroundColor Yellow
try {
    $testResult = ssh -o ConnectTimeout=5 $RemoteHost "echo 'Connected'"
    if ($testResult -eq "Connected") {
        Write-Host "  ✓ Successfully connected to $RemoteHost" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Connection test failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  ✗ Cannot connect to $RemoteHost" -ForegroundColor Red
    Write-Host "    Make sure SSH key authentication is set up" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 3: Create local directory
Write-Host "Step 3: Creating local directory..." -ForegroundColor Yellow
if (Test-Path $LocalPath) {
    Write-Host "  ⚠ Directory already exists: $LocalPath" -ForegroundColor Yellow
    $response = Read-Host "  Do you want to overwrite? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "  Installation cancelled." -ForegroundColor Red
        exit 0
    }
    Remove-Item -Path $LocalPath -Recurse -Force
}

New-Item -ItemType Directory -Path $LocalPath -Force | Out-Null
Write-Host "  ✓ Created: $LocalPath" -ForegroundColor Green
Write-Host ""

# Step 4: Copy files from remote
Write-Host "Step 4: Copying files from remote server..." -ForegroundColor Yellow
Write-Host "  This may take a minute..." -ForegroundColor Gray

try {
    # Copy the entire mcp-server directory
    scp -r "${RemoteHost}:${RemotePath}/*" $LocalPath
    Write-Host "  ✓ Files copied successfully" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to copy files" -ForegroundColor Red
    Write-Host "    Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 5: Install Node.js dependencies
Write-Host "Step 5: Installing Node.js dependencies..." -ForegroundColor Yellow
Push-Location $LocalPath

try {
    npm install --silent
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to install dependencies" -ForegroundColor Red
    Write-Host "    Try manually: cd $LocalPath && npm install" -ForegroundColor Yellow
    Pop-Location
    exit 1
}

Pop-Location
Write-Host ""

# Step 6: Test the server
Write-Host "Step 6: Testing MCP server..." -ForegroundColor Yellow

$testProcess = Start-Process -FilePath "node" -ArgumentList "$LocalPath\src\index.js" -PassThru -NoNewWindow -RedirectStandardError "$env:TEMP\hytale-mcp-test.log"
Start-Sleep -Seconds 2

if ($testProcess.HasExited) {
    Write-Host "  ✗ Server failed to start" -ForegroundColor Red
    Write-Host "    Check error log: $env:TEMP\hytale-mcp-test.log" -ForegroundColor Yellow
    exit 1
} else {
    Stop-Process -Id $testProcess.Id -Force
    $logContent = Get-Content "$env:TEMP\hytale-mcp-test.log" -Raw
    if ($logContent -match "Loaded \d+ blocks from registry") {
        Write-Host "  ✓ Server started successfully" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Server started but may have issues" -ForegroundColor Yellow
        Write-Host "    Log: $logContent" -ForegroundColor Gray
    }
}

Write-Host ""

# Step 7: Configure Claude Desktop
Write-Host "Step 7: Configuring Claude Desktop..." -ForegroundColor Yellow

$configContent = @{
    mcpServers = @{
        "hytale-prefab-generator" = @{
            command = "node"
            args = @("$LocalPath\src\index.js")
        }
    }
}

# Check if config file exists
if (Test-Path $ClaudeConfigPath) {
    Write-Host "  ⚠ Claude config already exists" -ForegroundColor Yellow
    $response = Read-Host "  Do you want to overwrite? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "  Skipping Claude configuration." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  Manually add this to $ClaudeConfigPath :" -ForegroundColor Cyan
        Write-Host ($configContent | ConvertTo-Json -Depth 10) -ForegroundColor Gray
        Write-Host ""
    } else {
        $configContent | ConvertTo-Json -Depth 10 | Set-Content -Path $ClaudeConfigPath -Encoding UTF8
        Write-Host "  ✓ Claude config updated" -ForegroundColor Green
    }
} else {
    # Create directory if it doesn't exist
    $configDir = Split-Path $ClaudeConfigPath -Parent
    if (-not (Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    }

    $configContent | ConvertTo-Json -Depth 10 | Set-Content -Path $ClaudeConfigPath -Encoding UTF8
    Write-Host "  ✓ Claude config created" -ForegroundColor Green
}

Write-Host ""

# Summary
Write-Host "=== Installation Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart Claude Desktop completely" -ForegroundColor White
Write-Host "  2. Open Claude and ask: 'List Hytale block categories'" -ForegroundColor White
Write-Host "  3. If tools work, start generating prefabs!" -ForegroundColor White
Write-Host ""
Write-Host "Installation details:" -ForegroundColor Cyan
Write-Host "  • MCP Server: $LocalPath" -ForegroundColor Gray
Write-Host "  • Claude Config: $ClaudeConfigPath" -ForegroundColor Gray
Write-Host "  • Generated prefabs: $LocalPath\prefabs\" -ForegroundColor Gray
Write-Host ""
Write-Host "Test the server manually:" -ForegroundColor Cyan
Write-Host "  cd $LocalPath" -ForegroundColor Gray
Write-Host "  node src\index.js" -ForegroundColor Gray
Write-Host ""
Write-Host "Troubleshooting:" -ForegroundColor Cyan
Write-Host "  See: $LocalPath\README.md" -ForegroundColor Gray
Write-Host "  Or:  $(Split-Path $LocalPath -Parent)\hytale-prefab-generator\INSTALL_LOCAL.md" -ForegroundColor Gray
Write-Host ""
