# Grp-2-module6

# Cocktail Finder App

Cocktail Finder is a full-stack web application built with **React**, **Vite**, **Flask**, **SQLAlchemy**, and **PostgreSQL**. The application allows users to browse, search, create, edit, and delete cocktail recipes, manage notes, and save favorite drinks.


## Features

* Browse cocktail recipes
* Search cocktails by name or category
* View cocktail details
* Add, edit, and delete cocktails
* Add, edit, and delete notes
* Save and remove favorite cocktails
* Responsive user interface
* RESTful Flask API
* PostgreSQL database with Flask-Migrate


## Technologies Used

### Frontend

* React
* React Router DOM
* JavaScript (ES6+)
* CSS
* Vite

### Backend

* Flask
* Flask-CORS
* Flask-SQLAlchemy
* Flask-Migrate

### Database

* PostgreSQL

### External API

* TheCocktailDB API (Cocktail Categories)


## Installation

```bash
git clone <repository-url>
cd Grp-2-module6/cocktail-finder
```

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd cocktail-finder/backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

python -m flask db upgrade
python seed.py
python app.py
```

Open the React application at the Vite URL (usually `http://localhost:5173`).


## Project Structure

```text
cocktail-finder/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── migrations/
│   ├── instance/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── models.py
│   ├── requirements.txt
│   └── seed.py
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── package.json
└── README.md
```

## API Endpoints

### Cocktails

* GET `/api/cocktails`
* GET `/api/cocktails/:id`
* POST `/api/cocktails`
* PUT `/api/cocktails/:id`
* DELETE `/api/cocktails/:id`

### Notes

* GET `/api/cocktails/:cocktailId/notes`
* POST `/api/cocktails/:cocktailId/notes`
* PUT `/api/notes/:id`
* DELETE `/api/notes/:id`

### Favorites

* GET `/api/favorites`
* POST `/api/favorites`
* DELETE `/api/favorites/:id`

## React Concepts

* Functional Components
* React Hooks (`useState`, `useEffect`)
* React Router
* Controlled Forms
* Async/Await
* REST API Integration
* Dynamic Rendering
* Component Reusability

## Authors

* Ouko Sharon
* Robert Tumsifu
* Beatrice Kogei
* Timothy Kangangi
* Cedrick Meka

**React Front-End Development Project © 2026**
