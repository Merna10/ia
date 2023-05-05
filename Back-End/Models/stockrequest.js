

module.exports = (db, type)=>{
  return db.define("stock_request",{
    id: {
      type : type.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    quantity: {
        type: type.INTEGER,
        allowNull: false
    },
    status: {
        type: type.ENUM('pending', 'approved', 'declined'),
        allowNull: false,
        defaultValue: 'pending'
    },
  },{
    timestamps: false, // disable timestamps
  });
};