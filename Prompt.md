Mission: 311 Accountability Ward Dashboard

Objective

Build a transparency-focused web application that correlates Chicago's 311 service response times with neighborhood socioeconomic data. The goal is to visualize whether wards with high "Hardship Index" scores experience significantly slower city services for essential infrastructure (potholes, streetlights, etc.).



Core Data Sources

Use the Chicago Open Data Portal JSON endpoints:



311 Performance: Median Response Time dataset (u6fz-87ei).



Hardship Data: Hardship Index Scores (hhd4-uf7v).



Geography: Boundaries - Wards (2023-) (p293-wvbd).



Tech Stack \& Architecture

Frontend: React, Tailwind CSS, and D3.js for data visualizations.



Backend/Processing: Python scripts executed via the Antigravity integrated terminal.



Hosting: Deploy to Vercel or GitHub Pages (Free Tiers).



Automation: GitHub Actions for daily data refreshes.



Mission Tasks for Agent

Initialize Project: Scaffold a Vite + React project with Tailwind CSS.



Data Orchestration (Terminal):



Create a Python script in the terminal that fetches the 311 median response data and joins it with the Hardship Index by community area/ward.



Clean the data to focus on high-impact service types (e.g., "Pothole in Street", "Street Light Out").



Export a processed summary\_data.json for the frontend to consume.



UI Implementation:



Interactive Map: Build a D3.js choropleth map of Chicago wards colored by response time.



Inequity Dashboard: Create a "Leaderboard" comparing the 5 fastest vs. 5 slowest wards alongside their Hardship Index.



Filter System: Allow users to toggle between different request types.



Verification (Browser Agent):



Use the Browser Sub-Agent to verify that the map renders and the filters correctly update the leaderboard.



Capture a recording of the "vibe" and functionality for final review.



Deployment \& Skills:



Generate a SKILL.md to define a daily-data-sync workflow.



Write a GitHub Action workflow to trigger this sync daily to keep the dashboard live without a server.



Constraints

Performance: All data processing should happen "at rest" (pre-generated JSON) to ensure the site stays fast on free hosting.



Security: Ensure no API keys are hardcoded; use .env for any sensitive configurations.



Vibe: Use a "Civic Tech" aesthetic—clean typography, high contrast, and accessible design for all residents.

