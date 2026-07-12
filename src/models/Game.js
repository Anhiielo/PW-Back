import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  platform: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'PC',
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Sin categoría',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Sin descripción',
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
}, {
  tableName: 'games',
  underscored: true,
});

export default Game;
