#!/bin/bash
echo "=== Searching system backups, trash, and temporary files ==="

# Search Trash
find ~/.local/share/Trash -name "*main_style*" 2>/dev/null

# Search KDE/Kate/Editor backups (~ files or .swp)
find . -name "*main_style*" -o -name "*main_style.css~" -o -name "*.swp" 2>/dev/null

# Search system cache / temp directories
find /tmp ~/.cache -name "*main_style*" 2>/dev/null

