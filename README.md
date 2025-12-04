# Top 2000 Music Galaxy ✨

> Interactive data visualization of the Dutch Top 2000 music countdown

An interactive data visualization exploring the Dutch Top 2000 music countdown, featuring scrollytelling narrative and dynamic D3.js visualizations.

## Features

- **Interactive Scrollytelling**: Scroll through different chapters to explore the music data
- **D3.js Visualizations**: Beautiful bubble chart showing 2000 songs positioned by release year
- **Search & Filter**: Real-time search by artist/song and decade filtering
- **Responsive Design**: Works on desktop and mobile devices
- **Professional Styling**: Modern glassmorphism design with smooth animations

## Tech Stack

- **Frontend**: React 18 + Vite
- **Visualization**: D3.js
- **Styling**: CSS with glassmorphism effects
- **Interactivity**: react-scrollama for scrollytelling

## Data Sources

- **Top 2000 List**: Radio 2's annual music countdown
- **Chart Data**: Mediamarkt's weekly Top 40 charts

## Local Development
 
```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Top2000Chart.jsx      # Main D3 visualization
│   └── ExploreSection.jsx    # Search/filter interface
├── hooks/
│   └── useTop2000Data.js     # Data loading hook
├── App.jsx                   # Main application
├── index.css                 # Global styles
└── main.jsx                  # Entry point

public/
└── data/
    └── top2000_2016_positions.csv  # Song data
```

## Author

Created by **Yijie Gu** as a personal data visualization project.

---

*This project is for educational and demonstration purposes.*
