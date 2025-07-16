
# Leads Finder

This project is a Next.js app for finding and ranking leads using web scraping and scoring logic.

## Features
- UI for filtering leads (see `public/leads-finder-ui-reference.png` for design reference)
- Backend API for web scraping and extracting leads
- Scoring and ranking of leads as "hot", "warm", or "cold"
- Display of ranked leads in the interface

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Development
- Edit the UI in `src/app/page.tsx` and related components.
- Implement backend scraping and scoring logic in `src/app/api/leads/route.ts`.

## Notes
- The UI reference is in `public/leads-finder-ui-reference.png`.
- Web scraping should be performed server-side only.

## License
MIT
