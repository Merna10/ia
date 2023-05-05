const Sequelize = require('sequelize');
const connection = require('../Config/DBConnection');

const UserModel = require('./user');
const WarehouseModel = require('./warehouse');
const ProductModel = require('./product');
const SupervisorModel = require('./supervisor');
const StockRequesModel = require('./stockrequest');

//convert models to tables (calling models functions)
const User = UserModel(connection, Sequelize);
const Warehouse = WarehouseModel(connection, Sequelize);
const Products = ProductModel(connection, Sequelize);
const Supervisor = SupervisorModel(connection, Sequelize);
const StockRequest = StockRequesModel(connection, Sequelize);

Products.belongsTo(Warehouse, {
  foreignKey: {
    name: 'warehouse_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    allowNull: false
  }
});

Supervisor.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    allowNull: false
  }
});
Supervisor.belongsTo(Warehouse, {
  foreignKey: {
    name: 'warehouse_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    allowNull: false
  }
});

StockRequest.belongsTo(Supervisor, {
  foreignKey: {
    name: 'supervisor_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    allowNull: false
  }
})

StockRequest.belongsTo(Products, {
  foreignKey: {
    name: 'products_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    allowNull: false
  }
})

// convert models to tables
// force:false => if tables are not created, create these tables
// make force:true => when you need to drop this schema and build it again
connection.sync({ force: false }).then(() => {
  console.log("Tables Created!");
});

//export tables
module.exports = {
  User,
  Warehouse,
  Products,
  Supervisor,
  StockRequest
};