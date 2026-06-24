# Cocktail Finder

Cocktail Finder is a full-stack React application with a Node.js backend. It supports CRUD operations for cocktails and notes, allowing users to browse, search, create, edit, and delete recipes while managing notes for each drink.

## Setup

1. Install dependencies:

```bash
cd Grp-2-module6/cocktail-finder
npm install
```

2. Start the backend:

```bash
npm run server
```

3. Start the frontend:

```bash
npm run dev
```

4. Visit the Vite URL shown in the terminal.

## Features

- Full CRUD for cocktails
- Notes linked to individual cocktails
- Search by name or category
- Add and save favorite drinks locally
- Responsive React UI with client-side routing

## Structure

- `src/` - React components and pages
- `server/` - Express API and data storage
```

## Quick API tests with curl

Make sure the backend is running (`npm run server`) and then try these commands from a terminal:

- List all cocktails:

```bash
curl http://localhost:4000/api/cocktails
```

- Get a single cocktail by id:

```bash
curl http://localhost:4000/api/cocktails/1
```

- Create a new cocktail:

```bash
curl -X POST http://localhost:4000/api/cocktails \
	-H 'Content-Type: application/json' \
	-d '{"name":"Sunrise","category":"Cocktail","alcoholic":"Alcoholic","glass":"Highball glass","image":"https://example.com/img.jpg","instructions":"Mix ingredients.","ingredients":["Orange juice","Vodka"]}'
```

- Update a cocktail (replace `<id>`):

```bash
curl -X PUT http://localhost:4000/api/cocktails/<id> \
	-H 'Content-Type: application/json' \
	-d '{"name":"Sunrise Updated"}'
```

- Delete a cocktail (replace `<id>`):

```bash
curl -X DELETE http://localhost:4000/api/cocktails/<id>
```

- List notes for a cocktail (replace `<cocktailId>`):

```bash
curl http://localhost:4000/api/cocktails/<cocktailId>/notes
```

- Add a note to a cocktail:

```bash
curl -X POST http://localhost:4000/api/cocktails/<cocktailId>/notes \
	-H 'Content-Type: application/json' \
	-d '{"text":"Try with fresh fruit."}'
```

- Update a note (replace `<noteId>`):

```bash
curl -X PUT http://localhost:4000/api/notes/<noteId> \
	-H 'Content-Type: application/json' \
	-d '{"text":"Updated note text."}'
```

- Delete a note (replace `<noteId>`):

```bash
curl -X DELETE http://localhost:4000/api/notes/<noteId>
```
