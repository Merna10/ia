module.exports = (db, type) => {
  return db.define("warehouses", {
    id: {
      type: type.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: type.STRING(255),
      allowNull: false
    },
    location: {
      type: type.STRING(255),
      allowNull: false
    },
    status: {
      type: type.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
  },{
    timestamps: false, // disable timestamps
  });
};
