module.exports = (db, type) => {
  return db.define("products", {
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
    description: {
      type: type.TEXT,
      allowNull: true
    },
    photo: {
      type: type.STRING(255),
      allowNull: true
    },
    stock: {
      type: type.INTEGER,
      allowNull: false
    },
  },{
    timestamps: false, // disable timestamps
  });
};