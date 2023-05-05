const User = require('./user');
const Warehouse = require('./warehouse');
module.exports= (db, type) => {
  return db.define("supervisor", {
  id: {
    type: type.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  
},{
  timestamps:false,
});
}


