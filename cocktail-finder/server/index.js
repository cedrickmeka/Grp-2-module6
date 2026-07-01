import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");
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

function ensureDataFile() {
  const exists = fs.existsSync(DB_PATH);
  const initialData = {
    cocktails: [
      {
        id: "1",
        name: "Classic Margarita",
        category: "Cocktail",
        alcoholic: "Alcoholic",
        glass: "Cocktail glass",
        image: "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
        instructions:
          "Rub the rim of the glass with the lime slice to make the salt stick to it. Shake the other ingredients with ice, then carefully pour into the glass.",
        ingredients: ["Tequila", "Triple sec", "Lime juice", "Salt"],
        userId: null,
      },
      {
        id: "2",
        name: "Mojito",
        category: "Cocktail",
        alcoholic: "Alcoholic",
        glass: "Highball glass",
        image: "https://www.thecocktaildb.com/images/media/drink/3z6xdi1589574603.jpg",
        instructions:
          "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water. Garnish with mint sprig.",
        ingredients: ["Light rum", "Lime", "Sugar", "Mint", "Soda water"],
        userId: null,
      },
      {
        id: "3",
        name: "Espresso Martini",
        category: "Cocktail",
        alcoholic: "Alcoholic",
        glass: "Martini glass",
        image: "https://www.thecocktaildb.com/images/media/drink/n0sx531504372951.jpg",
        instructions:
          "Add vodka, coffee liqueur, and espresso into a shaker filled with ice. Shake well and strain into a chilled glass.",
        ingredients: ["Vodka", "Coffee liqueur", "Fresh espresso"],
        userId: null,
      },
    ],
    notes: [
      {
        id: "1",
        cocktailId: "1",
        text: "Try using fresh lime juice for the best flavor.",
        createdAt: new Date().toISOString(),
        userId: null,
      },
      {
        id: "2",
        cocktailId: "2",
        text: "Lightly crush the mint to release the aroma without making it bitter.",
        createdAt: new Date().toISOString(),
        userId: null,
      },
    ],
    users: [],
    sessions: [],
  };

  if (!exists) {
    writeData(initialData);
    return initialData;
  }

  const data = readData();
  if (!Array.isArray(data.cocktails) || !Array.isArray(data.notes) || !Array.isArray(data.users) || !Array.isArray(data.sessions)) {
    writeData(initialData);
    return initialData;
  }

  data.cocktails = data.cocktails.map((cocktail) => ({ ...cocktail, userId: cocktail.userId ?? null }));
  data.notes = data.notes.map((note) => ({ ...note, userId: note.userId ?? null }));
  return data;
}

const data = ensureDataFile();

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
  writeData(data);
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

app.get("/", (req, res) => {
  res.send({ message: "Cocktail Finder API is running." });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
