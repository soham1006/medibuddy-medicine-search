# Medicine Search App

A simple and responsive React application for searching medicine information using the FDA Drug Label API.

## Features

- Search medicines by brand name
- Display search results in clean cards
- View detailed medicine information
- Loading, empty, and error states
- Responsive design
- Request cancellation for outdated searches
- Basic caching for repeated searches
- Search state preserved in the URL

## Tech Stack

- React
- React Router
- JavaScript
- Vite
- CSS
- FDA Drug Label API

## Run Locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

## Performance

The application uses request cancellation to avoid outdated responses and simple in-memory caching to reduce repeated API calls. `React.memo` is used for medicine cards to avoid unnecessary re-renders.

## Data Source

Medicine information is provided by the FDA Drug Label API.

## Note

This project is built for demonstration purposes. The displayed information should not be considered medical advice.