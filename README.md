# Grp-2-module6

## Cocktail Finder Full-Stack App

This project contains a full-stack cocktail recipe application built with React and a Node.js/Express backend.

Users can:

- Browse cocktails
- Search by name or category
- Create, edit, and delete cocktail recipes
- Add and manage notes for each cocktail
- Save favorite drinks in browser storage

## Setup

1. Navigate to the application folder:

```bash
cd Grp-2-module6/cocktail-finder
```

2. Install dependencies:

```bash
npm install
```

3. Start the backend API server:

```bash
npm run server
```

4. Start the frontend app:

```bash
npm run dev
```

5. Open the Vite development URL shown in the terminal.

---

## App structure

- `src/` — React frontend
- `server/` — Express API and JSON datastore

---

## Notes

The server persists cocktails and notes to `server/db.json`, with sample seed data on first run.

---

## Features

* Search cocktails by name
* Display cocktail images and categories
* View detailed cocktail information
* Dynamic rendering of API results
* Responsive user interface
* Navigation using React Router
* Favorites page for saved drinks

---

## Technologies Used

* React
* React Router DOM
* JavaScript
* CSS
* Vite
* TheCocktailDB API

---

## Installation and Setup

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the project folder:

```bash
cd cocktail-finder
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the application in your browser using the URL displayed in the terminal.

---

## API Used

### TheCocktailDB

Base URL:

https://www.thecocktaildb.com/api/json/v1/1/

---

## Application Structure

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   └── DrinkCard.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── DrinkDetails.jsx
│   └── Favorites.jsx
│
├── services/
│   └── cocktailApi.js
│
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

---

## React Concepts Demonstrated

* Functional Components
* useState Hook
* API Fetching with async/await
* Controlled Forms
* Dynamic Rendering with map()
* React Router Navigation
* Component Reusability
* State Management

---

## Authors

Ouko Sharon.
Robert Tumsifu
Beatrice Kogei
Timothy Kangangi

React Front-End Development Project @26
