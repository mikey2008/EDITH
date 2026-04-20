# EDITH: AI Research Assistant 🌐

EDITH is a minimalist, deeply integrated React web application that functions as a lightweight open-source research assistant. Inspired by futuristic UI concepts and stark minimalism, parsing the internet to present concise text summaries, dates, and trivia.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- **Heuristic Wikipedia Data Extraction**: Bypasses traditional AI tokens. Connects directly to Wikipedia's open source API, filters out shallow "disambiguation" pages, and intelligently extracts the deepest matching information.
- **Auto-Formatting Engine**: Uses Regex-driven filtering to categorize data gracefully into:
  - `Overview`: A succinct 2-sentence summary of the topic.
  - `Important Dates`: Extracts sentences heavily anchored by years (e.g., 1900-2099) for quick historical context.
  - `Fun Facts`: Safely isolates a remaining piece of intel for trivia.
- **Futuristic UI**: A fully responsive, dark-mode, minimalist design featuring clean CSS glassmorphism hints and custom spinners.

## 🚀 Getting Started

To run EDITH locally, follow these simple steps:

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. Clone this repository (or copy the files):
   ```bash
   git clone <your-github-repo-url>
   ```

2. Navigate into the project directory:
   ```bash
   cd EDITH
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173/`. 

## 🛠 Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, Animations)
- **Data Source**: Wikipedia Open REST API

## 💡 How it works
1. **Search**: Enter a topic like `"black holes"` or `"world war 2"`.
2. **Fetch**: EDITH scans Wikipedia's top 3 results, verifying that it has substantial deep-linked info.
3. **Analyze**: The text is broken down procedurally into components.
4. **Display**: The UI conditionally renders the formatted data blocks dynamically.

---
*Created as part of Class 12 CS Project.*
