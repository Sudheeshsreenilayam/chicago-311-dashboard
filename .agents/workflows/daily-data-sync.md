---
description: Refresh Chicago 311 and Hardship data for the dashboard
---
# Daily Data Sync

This workflow updates the JSON data for the Chicago 311 Accountability Dashboard.

1. Navigate to the project directory: `d:/Antigravity/311`
// turbo
2. Install dependencies: `pip install -r scripts/requirements.txt`
// turbo
3. Run the data fetch script: `python scripts/fetch_data.py`

If any column errors occur due to Socrata API changes, inspect `v6vf-nfxy` columns and update `fetch_data.py` accordingly.
