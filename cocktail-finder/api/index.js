import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "..", "server", "db.json");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

function readData() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    return { cocktails: [], notes: [], users: [], sessions: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const data = readData();

function getNextId(items) {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

function verifyPassword(password, storedHash, storedSalt) {
  return hashPassword(password, storedSalt).hash === storedHash;
}

function sanitizeUser(user) {
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

function createSession(user) {
  const token = crypto.randomBytes(24).toString("hex");
  data.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  writeData(data);
  return token;
}

function authenticate(req, res, next) {
  const authHeader = req.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const session = data.sessions.find((item) => item.token === token);
  if (!session) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  const user = data.users.find((item) => item.id === session.userId);
  if (!user) {
    return res.status(401).json({ message: "User not found." });
  }

  req.user = user;
  req.token = token;
  next();
}

function paginate(items, page, perPage) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePerPage = Math.max(1, Math.min(50, Number(perPage) || 10));
  const start = (safePage - 1) * safePerPage;
  const end = start + safePerPage;

  return {
    items: items.slice(start, end),
    page: safePage,
    per_page: safePerPage,
    total: items.length,
  };
}

function isOwnedByUser(record, user) {
  return record.userId === user.id;
}

app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (data.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const { hash, salt } = hashPassword(password);
  const user = {
    id: getNextId(data.users),
    name,
    email: email.toLowerCase(),
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };

  data.users.push(user);
  const token = createSession(user);
  res.status(201).json({ token, user: sanitizeUser(user) });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = data.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash, user.salt)) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = createSession(user);
  res.json({ token, user: sanitizeUser(user) });
});

app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

app.post("/api/auth/logout", authenticate, (req, res) => {
  data.sessions = data.sessions.filter((session) => session.token !== req.token);
  writeData(data);
  res.json({ message: "Logged out successfully." });
});

app.get("/api/cocktails", authenticate, (req, res) => {
  const search = (req.query.search || "").toLowerCase();
  const page = req.query.page;
  const perPage = req.query.per_page;
  let cocktails = data.cocktails.filter((cocktail) => isOwnedByUser(cocktail, req.user));

  if (search) {
    cocktails = cocktails.filter(
      (cocktail) =>
        cocktail.name.toLowerCase().includes(search) ||
        cocktail.category.toLowerCase().includes(search)
    );
  }

  res.json(paginate(cocktails, page, perPage));
});

app.get("/api/cocktails/:id", authenticate, (req, res) => {
  const cocktail = data.cocktails.find((item) => item.id === req.params.id);
  if (!cocktail || !isOwnedByUser(cocktail, req.user)) {
    return res.status(404).json({ message: "Cocktail not found" });
  }
  res.json(cocktail);
});

app.post("/api/cocktails", authenticate, (req, res) => {
  const { name, category, alcoholic, glass, image, instructions, ingredients } = req.body;
  if (!name || !instructions) {
    return res.status(400).json({ message: "Cocktail name and instructions are required." });
  }

  const newCocktail = {
    id: getNextId(data.cocktails),
    name,
    category: category || "Cocktail",
    alcoholic: alcoholic || "Alcoholic",
    glass: glass || "Cocktail glass",
    image: image || "https://www.thecocktaildb.com/images/media/drink/rvwrqq1472817326.jpg",
    instructions,
    ingredients: Array.isArray(ingredients)
      ? ingredients.filter(Boolean)
      : [ingredients].filter(Boolean),
    userId: req.user.id,
  };

  data.cocktails.unshift(newCocktail);
  writeData(data);
  res.status(201).json(newCocktail);
});

app.put("/api/cocktails/:id", authenticate, (req, res) => {
  const cocktail = data.cocktails.find((item) => item.id === req.params.id);
  if (!cocktail || !isOwnedByUser(cocktail, req.user)) {
    return res.status(404).json({ message: "Cocktail not found" });
  }

  const { name, category, alcoholic, glass, image, instructions, ingredients } = req.body;
  cocktail.name = name || cocktail.name;
  cocktail.category = category || cocktail.category;
  cocktail.alcoholic = alcoholic || cocktail.alcoholic;
  cocktail.glass = glass || cocktail.glass;
  cocktail.image = image || cocktail.image;
  cocktail.instructions = instructions || cocktail.instructions;
  cocktail.ingredients = Array.isArray(ingredients)
    ? ingredients.filter(Boolean)
    : ingredients
      ? [ingredients].filter(Boolean)
      : cocktail.ingredients;

  writeData(data);
  res.json(cocktail);
});

app.delete("/api/cocktails/:id", authenticate, (req, res) => {
  const cocktailIndex = data.cocktails.findIndex((item) => item.id === req.params.id);
  if (cocktailIndex === -1 || !isOwnedByUser(data.cocktails[cocktailIndex], req.user)) {
    return res.status(404).json({ message: "Cocktail not found" });
  }

  data.cocktails.splice(cocktailIndex, 1);
  data.notes = data.notes.filter((note) => note.cocktailId !== req.params.id);
  writeData(data);
  res.status(204).end();
});

app.get("/api/notes", authenticate, (req, res) => {
  const page = req.query.page;
  const perPage = req.query.per_page;
  const notes = data.notes.filter((note) => isOwnedByUser(note, req.user));
  res.json(paginate(notes, page, perPage));
});

app.get("/api/cocktails/:cocktailId/notes", authenticate, (req, res) => {
  const cocktail = data.cocktails.find((item) => item.id === req.params.cocktailId);
  if (!cocktail || !isOwnedByUser(cocktail, req.user)) {
    return res.status(404).json({ message: "Cocktail not found" });
  }

  const page = req.query.page;
  const perPage = req.query.per_page;
  const notes = data.notes.filter((note) => note.cocktailId === req.params.cocktailId && isOwnedByUser(note, req.user));
  res.json(paginate(notes, page, perPage));
});

app.post("/api/cocktails/:cocktailId/notes", authenticate, (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Note text is required." });
  }

  const cocktail = data.cocktails.find((item) => item.id === req.params.cocktailId);
  if (!cocktail || !isOwnedByUser(cocktail, req.user)) {
    return res.status(404).json({ message: "Cocktail not found." });
  }

  const newNote = {
    id: getNextId(data.notes),
    cocktailId: req.params.cocktailId,
    text,
    createdAt: new Date().toISOString(),
    userId: req.user.id,
  };

  data.notes.push(newNote);
  writeData(data);
  res.status(201).json(newNote);
});

app.put("/api/notes/:id", authenticate, (req, res) => {
  const note = data.notes.find((item) => item.id === req.params.id);
  if (!note || !isOwnedByUser(note, req.user)) {
    return res.status(404).json({ message: "Note not found." });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Note text is required." });
  }

  note.text = text;
  writeData(data);
  res.json(note);
});

app.delete("/api/notes/:id", authenticate, (req, res) => {
  const noteIndex = data.notes.findIndex((item) => item.id === req.params.id);
  if (noteIndex === -1 || !isOwnedByUser(data.notes[noteIndex], req.user)) {
    return res.status(404).json({ message: "Note not found." });
  }

  data.notes.splice(noteIndex, 1);
  writeData(data);
  res.status(204).end();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({ message: "Cocktail Finder API is running." });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;
