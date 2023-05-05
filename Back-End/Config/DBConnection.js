// connect to db using sequelize ORM

const Sequelize = require("sequelize");
const config = require("./config");

// create db connection
const connection = new Sequelize(
    config.database,
    config.username,
    config.password,
     {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

// connect to db
connection
  .authenticate() //connect and test the connection
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

// export connection
module.exports = connection;

