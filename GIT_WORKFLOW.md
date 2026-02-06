# Git Workflow Guide

Use git to sync files between your remote Linux machine and local Windows machine.

## Initial Setup

### On Remote Machine (MEGALODON) - Already Done ✅

```bash
cd /home/giovanni/scratch/hytale-prefab-generator
git init
git add -A
git commit -m "Initial commit"
```

### Create GitHub Repository (Optional but Recommended)

1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `hytale-prefab-generator`
3. Make it **private** (contains game assets data)
4. Don't initialize with README (we already have one)

### Connect to GitHub (Remote Machine)

```bash
# Add remote
git remote add origin https://github.com/YOUR-USERNAME/hytale-prefab-generator.git

# Push
git push -u origin main
```

## Sync to Your Local Windows Machine

### First Time Setup (Windows)

```powershell
# Navigate to where you want the project
cd C:\Projects

# Clone the repository
git clone https://github.com/YOUR-USERNAME/hytale-prefab-generator.git

# Enter directory
cd hytale-prefab-generator\mcp-server

# Install dependencies
npm install

# You're ready!
```

### Configure Claude Desktop (Windows)

Edit: `C:\Users\Giovanni\AppData\Roaming\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": ["C:\\Projects\\hytale-prefab-generator\\mcp-server\\src\\index.js"]
    }
  }
}
```

## Daily Workflow

### Scenario 1: Made Changes on Remote, Want Them Locally

**On remote machine (MEGALODON)**:
```bash
cd /home/giovanni/scratch/hytale-prefab-generator

# Stage changes
git add -A

# Commit
git commit -m "Add new feature X"

# Push to GitHub
git push
```

**On local machine (Windows)**:
```powershell
cd C:\Projects\hytale-prefab-generator

# Pull latest changes
git pull

# If dependencies changed, reinstall
cd mcp-server
npm install
```

### Scenario 2: Made Changes Locally, Want to Push

**On local machine (Windows)**:
```powershell
cd C:\Projects\hytale-prefab-generator

# Stage changes
git add -A

# Commit
git commit -m "Update configuration"

# Push
git push
```

**On remote machine (MEGALODON)**:
```bash
cd /home/giovanni/scratch/hytale-prefab-generator

# Pull latest changes
git pull
```

## Useful Commands

### Check Status
```bash
git status
# Shows: modified files, untracked files, current branch
```

### View Changes
```bash
git diff
# Shows what changed in your files
```

### View Commit History
```bash
git log --oneline
# Shows recent commits
```

### Discard Local Changes
```bash
# Discard changes in a specific file
git checkout -- filename.js

# Discard all local changes (CAREFUL!)
git reset --hard HEAD
```

### Update from GitHub
```bash
git pull
# Fetches and merges latest changes
```

### See What Branch You're On
```bash
git branch
# * main  (asterisk shows current branch)
```

## Working with Branches (Optional)

If you want to experiment without affecting main:

```bash
# Create and switch to new branch
git checkout -b feature/web-preview

# Make changes, commit them
git add -A
git commit -m "Add web preview app"

# Push branch to GitHub
git push -u origin feature/web-preview

# Switch back to main
git checkout main

# Merge feature when ready
git merge feature/web-preview
```

## Handling Conflicts

If you made changes on both machines:

```bash
git pull
# If there's a conflict:
# CONFLICT (content): Merge conflict in mcp-server/src/index.js
```

**Fix conflicts**:
1. Open the file in an editor
2. Look for conflict markers:
   ```
   <<<<<<< HEAD
   Your local changes
   =======
   Remote changes
   >>>>>>> origin/main
   ```
3. Edit to keep what you want
4. Remove the markers
5. Save the file
6. Commit:
   ```bash
   git add .
   git commit -m "Resolve merge conflict"
   git push
   ```

## .gitignore - What's NOT Tracked

These files/folders are ignored (see `.gitignore`):
- `node_modules/` - npm dependencies (too large, reinstall with `npm install`)
- `*.log` - Log files
- `/tmp/` - Temporary files
- OS files (.DS_Store, Thumbs.db)

## Best Practices

### ✅ DO:
- Commit often with clear messages
- Pull before starting work
- Push when you're done for the day
- Use meaningful commit messages

### ❌ DON'T:
- Commit `node_modules/` (it's in .gitignore)
- Commit sensitive data (API keys, passwords)
- Force push (`git push --force`) unless you know what you're doing
- Commit broken code (test first!)

## Quick Reference

| Task | Command |
|------|---------|
| Check status | `git status` |
| Stage all changes | `git add -A` |
| Commit | `git commit -m "message"` |
| Push to GitHub | `git push` |
| Pull from GitHub | `git pull` |
| Clone repository | `git clone <url>` |
| View history | `git log --oneline` |
| Create branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| Discard changes | `git checkout -- filename` |

## Alternative: Without GitHub (Direct Remote)

If you don't want to use GitHub:

**On local Windows machine**:
```powershell
# Clone directly from remote machine via SSH
git clone giovanni@MEGALODON:/home/giovanni/scratch/hytale-prefab-generator C:\Projects\hytale-prefab-generator

# Pull updates
git pull

# Push changes
git push
```

This uses SSH instead of GitHub as the "remote".

## Example Session

```bash
# Morning: Start work on remote machine
cd /home/giovanni/scratch/hytale-prefab-generator
git pull  # Get latest changes

# ... make changes to src/index.js ...

git add src/index.js
git commit -m "Add rotation support"
git push

# Afternoon: Continue on Windows machine
cd C:\Projects\hytale-prefab-generator
git pull  # Downloads your morning changes

# ... test and make more changes ...

git add -A
git commit -m "Test rotation feature"
git push

# Back on remote machine later
git pull  # Get afternoon changes
```

## Troubleshooting

### "fatal: not a git repository"
```bash
# You're not in the right directory
cd /home/giovanni/scratch/hytale-prefab-generator
```

### "Permission denied (publickey)"
```bash
# SSH key not set up for GitHub
# Use HTTPS instead, or set up SSH key
git remote set-url origin https://github.com/YOUR-USERNAME/hytale-prefab-generator.git
```

### "Your branch is ahead/behind origin/main"
```bash
# Ahead: You have local commits not pushed
git push

# Behind: Remote has commits you don't have
git pull
```

### "Please commit your changes or stash them"
```bash
# You have uncommitted changes blocking pull
# Option 1: Commit them
git add -A
git commit -m "WIP"
git pull

# Option 2: Stash them temporarily
git stash
git pull
git stash pop
```

---

## Summary

**Instead of**:
```bash
scp file.js giovanni@MEGALODON:/path/to/file.js
```

**Do this**:
```bash
git add file.js
git commit -m "Update file"
git push
```

**Then on the other machine**:
```bash
git pull
```

Way cleaner! 🎉
