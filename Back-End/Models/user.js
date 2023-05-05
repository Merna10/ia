
module.exports = (db, type) => {
  return db.define("users", {
    id: {
      type: type.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: type.STRING(255),
      allowNull: false
    },
    password: {
      type: type.STRING(255),
      allowNull: false
    },
    phone: {
      type: type.STRING(20),
      allowNull: false
    },
    status: {
      type: type.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
    type: {
      type: type.ENUM('admin', 'supervisor'),
      allowNull: false
    }, 
    token:{
      type: type.STRING(255),
      allowNull: false 
    }
    
  },{
    timestamps: false, // disable timestamps
  });
};
