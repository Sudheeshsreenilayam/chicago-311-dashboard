# 🏙️ Chicago 311 Accountability Dashboard

[![Deploy to GitHub Pages](https://github.com/sudhi/chicago-311-dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/sudhi/chicago-311-dashboard/actions/workflows/deploy.yml)

An interactive, live-updating civic tech dashboard correlating **Chicago 311 service response times** with neighborhood **Hardship Indices**. 

This tool aims to expose potential structural bottlenecks in city infrastructure maintenance. It provides citizens, journalists, and urban planners a transparent view into whether essential services (like pothole repair and street light maintenance) are equitably delivered across all 50 Chicago Wards, regardless of a neighborhood's economic status.

![Chicago 311 Accountability Dashboard](dashboard/public/banner.png)

## 📌 Features
- **🏙️ Interactive Choropleth Map:** Powered by D3.js, visually explore median response times for 2+ million historical service requests across all 50 wards.
- **📈 Socioeconomic Correlation:** Compares 311 response tracking directly against the Chicago Hardship Index (a composite score of poverty, housing, and unemployment metrics).
- **⏱️ Live Data Sync:** An automated nightly pipeline extracts and aggregates the latest records straight from the Chicago Open Data Portal.
- **🏷️ Deep Filtering:** Isolate critical structural requests (Graffiti, Garbage, Potholes, Noise).
- **📥 Open Data Export:** Instantly download the aggregated correlation datasets as clean CSV or XLSX files for independent tabular analysis.
- **🔗 Direct Action:** Integrated links to the official City of Chicago portal to immediately raise local block requests.

## 🛠️ How It Works (For Developers)

This repository operates entirely without a traditional backend database or active web server. It uses a **Static-Site Data Orchestration** pattern:

1.  **The Brain (Python):** Every night at midnight, GitHub Actions executes `scripts/fetch_data.py`. This script pulls millions of rows from the SODA API, crunches the medians, joins the geographic Ward boundaries, and spits out a tiny `summary_data.json` file.
2.  **The Muscle (GitHub Actions):** The automation pipeline commits this new JSON file directly back into the repository.
3.  **The Face (React + Vite):** GitHub Pages immediately rebuilds the React frontend (`dashboard/`). When a user visits the site, the browser simply reads that static, pre-calculated JSON file, allowing the dashboard to load instantly with zero API costs.

### Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, SheetJS
- **Data Visualization:** D3.js (GeoMercator projection, semantic semantic zooming)
- **Data Pipeline:** Python (Pandas, Requests)
- **CI/CD:** GitHub Actions & GitHub Pages

## 🚀 Running Locally

If you want to fork this project or run the developer environment on your own machine:

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/chicago-311-dashboard.git
   cd chicago-311-dashboard
   ```

2. **Generate the Data (Optional):**
   *(The repo already contains the latest data, but you can pull fresh data manually)*
   ```bash
   pip install -r scripts/requirements.txt
   python scripts/fetch_data.py
   ```

3. **Start the Frontend Dashboard:**
   ```bash
   cd dashboard
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000` (or the port Vite provides) in your browser.

## 📊 Data Sources
All data driving this application is sourced directly from the **City of Chicago Data Portal**:
*   [311 Service Requests (Historical & Current)](https://data.cityofchicago.org/Service-Requests/311-Service-Requests/)
*   [Selected socioeconomic indicators in Chicago, 2008 – 2012](https://data.cityofchicago.org/Health-Human-Services/Census-Data-Selected-socioeconomic-indicators-in-C/kn9c-c2s2)
*   [Boundaries - Wards (2015-2023)](https://data.cityofchicago.org/Facilities-Geographic-Boundaries/Boundaries-Wards-2015-2023-/sp34-6z76)

---
*Built as an open-source civic technology exploration.*
