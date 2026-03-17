#!/usr/bin/env python3
import subprocess
import re
import os
import sys

os.chdir(r'c:\Users\PMLS\OneDrive\Desktop\wheeseease System')

# Get all commits that touch step8_live_api.py
result = subprocess.run(['git', 'log', '--pretty=format:%H', '--', 'wheezeease-ai/step8_live_api.py'], 
                       capture_output=True, text=True)
commits = result.stdout.strip().split('\n')

print(f"Found {len(commits)} commits touching step8_live_api.py")

# Use git filter-branch to clean each commit
subprocess.run([
    'git', 'filter-branch', '-f',
    '--tree-filter',
    'sed -i "s/OPENWEATHER_KEY = \\"[^\\"]*\\"/OPENWEATHER_KEY = os.getenv(\\\"OPENWEATHER_API_KEY\\\", \\\"\\\")/g" wheezeease-ai/step8_live_api.py || true && '
    'sed -i "s/WAQI_KEY = \\"[^\\"]*\\"/WAQI_KEY = os.getenv(\\\"WAQI_API_KEY\\\", \\\"\\\")/g" wheezeease-ai/step8_live_api.py || true',
    '--', '--all'
], env={**os.environ, 'FILTER_BRANCH_SQUELCH_WARNING': '1'})

print("History cleaned!")
