import sequelize from '../config/database.js';
import User from './User.js';
import Game from './Game.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

// ─── Relaciones ─────────────────────────────────────────────────────────────

// User tiene muchas Orders
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order tiene muchos OrderItems
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Game tiene muchos OrderItems
Game.hasMany(OrderItem, { foreignKey: 'game_id', as: 'orderItems' });
OrderItem.belongsTo(Game, { foreignKey: 'game_id', as: 'game' });

export { sequelize, User, Game, Order, OrderItem };
