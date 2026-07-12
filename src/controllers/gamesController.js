import { Game, Order, OrderItem } from '../models/index.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// ─── GAMES ────────────────────────────────────────────────────────────────────

export const getAllGames = async (req, res) => {
  try {
    const { platform, category, search, minPrice, maxPrice } = req.query;

    const where = {};

    if (platform && platform !== 'all') {
      where.platform = platform;
    }
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (minPrice) {
      where.price = { ...(where.price || {}), [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
      where.price = { ...(where.price || {}), [Op.lte]: parseFloat(maxPrice) };
    }

    const games = await Game.findAll({ where, order: [['id', 'ASC']] });

    // Mapear image_url a imageUrl y convertir price a número (pg devuelve DECIMAL como string)
    const result = games.map(g => {
      const plain = g.toJSON();
      return { ...plain, imageUrl: plain.image_url, price: parseFloat(plain.price) };
    });

    res.json(result);
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado.' });

    const plain = game.toJSON();
    res.json({ ...plain, imageUrl: plain.image_url, price: parseFloat(plain.price) });
  } catch (error) {
    console.error('Error al obtener juego:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const createGame = async (req, res) => {
  try {
    const { title, platform, price, description, imageUrl, category, stock } = req.body;
    if (!title || !price) {
      return res.status(400).json({ message: 'Título y precio son requeridos.' });
    }

    const newGame = await Game.create({
      title,
      platform: platform || 'PC',
      price: parseFloat(price),
      description: description || 'Sin descripción',
      image_url: imageUrl || `https://placehold.co/600x900/1e293b/ffffff?text=${encodeURIComponent(title)}`,
      category: category || 'Sin categoría',
      stock: stock !== undefined ? parseInt(stock) : 10,
    });

    const plain = newGame.toJSON();
    res.status(201).json({ ...plain, imageUrl: plain.image_url, price: parseFloat(plain.price) });
  } catch (error) {
    console.error('Error al crear juego:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado.' });

    const { title, platform, price, description, imageUrl, category, stock } = req.body;

    await game.update({
      title: title ?? game.title,
      platform: platform ?? game.platform,
      price: price !== undefined ? parseFloat(price) : game.price,
      description: description ?? game.description,
      image_url: imageUrl ?? game.image_url,
      category: category ?? game.category,
      stock: stock !== undefined ? parseInt(stock) : game.stock,
    });

    const plain = game.toJSON();
    res.json({ ...plain, imageUrl: plain.image_url, price: parseFloat(plain.price) });
  } catch (error) {
    console.error('Error al actualizar juego:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado.' });

    await game.destroy();
    res.json({ message: 'Juego eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar juego:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────

export const checkout = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    // Calcular total
    const total = items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    // Crear la orden asociada al usuario autenticado
    const order = await Order.create({
      user_id: req.user.id,
      total,
      status: 'COMPLETED',
    }, { transaction });

    // Crear los items con sus keys generadas
    const orderItems = [];
    for (const item of items) {
      const randomKey = Math.random().toString(36).substring(2, 10).toUpperCase();
      const keyGenerated = `${randomKey.slice(0, 4)}-${randomKey.slice(4, 8)}`;

      const orderItem = await OrderItem.create({
        order_id: order.id,
        game_id: item.id,
        price: parseFloat(item.price || 0),
        quantity: 1,
        key_generated: keyGenerated,
      }, { transaction });

      // Reducir stock del juego
      await Game.decrement('stock', {
        by: 1,
        where: { id: item.id },
        transaction,
      });

      orderItems.push({
        ...item,
        keyGenerated,
        purchaseDate: new Date().toLocaleDateString('es-PE'),
      });
    }

    await transaction.commit();

    res.json({ success: true, purchasedItems: orderItems });
  } catch (error) {
    await transaction.rollback();
    console.error('Error en checkout:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
