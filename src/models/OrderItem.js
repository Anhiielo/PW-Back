import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  game_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  key_generated: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'order_items',
  underscored: true,
  timestamps: false, // No necesita created_at/updated_at
});

export default OrderItem;
