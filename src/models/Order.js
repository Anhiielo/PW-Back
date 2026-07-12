import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'COMPLETED',
    validate: {
      isIn: [['PENDING', 'COMPLETED', 'CANCELED']],
    },
  },
}, {
  tableName: 'orders',
  underscored: true,
});

export default Order;
