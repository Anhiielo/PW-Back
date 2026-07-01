import { games, users } from '../data/mockData.js';

// Estado en memoria (persiste mientras el servidor esté corriendo)
let gamesDB = [...games];
let usersDB = [...users];

// ─── GAMES ────────────────────────────────────────────────────────────────────

export const getAllGames = (req, res) => {
  const { platform, category, search, minPrice, maxPrice } = req.query;

  let result = [...gamesDB];

  if (platform && platform !== 'all') {
    result = result.filter(g => g.platform === platform);
  }
  if (category && category !== 'all') {
    result = result.filter(g => g.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(g =>
      g.title.toLowerCase().includes(q) ||
      (g.category && g.category.toLowerCase().includes(q)) ||
      (g.description && g.description.toLowerCase().includes(q))
    );
  }
  if (minPrice) result = result.filter(g => g.price >= parseFloat(minPrice));
  if (maxPrice) result = result.filter(g => g.price <= parseFloat(maxPrice));

  res.json(result);
};

export const getGameById = (req, res) => {
  const game = gamesDB.find(g => g.id === parseInt(req.params.id));
  if (!game) return res.status(404).json({ message: 'Juego no encontrado.' });
  res.json(game);
};

export const createGame = (req, res) => {
  const { title, platform, price, description, imageUrl, category } = req.body;
  if (!title || !price) {
    return res.status(400).json({ message: 'Título y precio son requeridos.' });
  }
  const newGame = {
    id: Date.now(),
    title,
    platform: platform || 'PC',
    price: parseFloat(price),
    description: description || 'Sin descripción',
    imageUrl: imageUrl || `https://placehold.co/600x900/1e293b/ffffff?text=${encodeURIComponent(title)}`,
    category: category || 'Sin categoría',
  };
  gamesDB.unshift(newGame);
  res.status(201).json(newGame);
};

export const updateGame = (req, res) => {
  const id = parseInt(req.params.id);
  const index = gamesDB.findIndex(g => g.id === id);
  if (index === -1) return res.status(404).json({ message: 'Juego no encontrado.' });

  const { title, platform, price, description, imageUrl, category } = req.body;
  gamesDB[index] = {
    ...gamesDB[index],
    title: title ?? gamesDB[index].title,
    platform: platform ?? gamesDB[index].platform,
    price: price !== undefined ? parseFloat(price) : gamesDB[index].price,
    description: description ?? gamesDB[index].description,
    imageUrl: imageUrl ?? gamesDB[index].imageUrl,
    category: category ?? gamesDB[index].category,
  };

  res.json(gamesDB[index]);
};

export const deleteGame = (req, res) => {
  const id = parseInt(req.params.id);
  const index = gamesDB.findIndex(g => g.id === id);
  if (index === -1) return res.status(404).json({ message: 'Juego no encontrado.' });
  gamesDB.splice(index, 1);
  res.json({ message: 'Juego eliminado correctamente.' });
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  const user = usersDB.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenciales incorrectas.' });
  }

  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe });
};

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────

export const checkout = (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'El carrito está vacío.' });
  }

  const itemsWithKeys = items.map(item => {
    const randomKey = Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      ...item,
      keyGenerated: `${randomKey.slice(0, 4)}-${randomKey.slice(4, 8)}`,
      purchaseDate: new Date().toLocaleDateString('es-PE'),
    };
  });

  res.json({ success: true, purchasedItems: itemsWithKeys });
};
