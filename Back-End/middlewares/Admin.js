
const {User} = require("../Models/DB");
const util = require("util"); //helper function


const admin = async (req, res, next) => {
    const { token } = req.headers;
  
    try {
      const admin = await User.findOne({ where: { token: token, type: 'admin' } });
      if (admin) {
        next();
      } else {
        res.status(403).json({ msg: "you are not authorized" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }

module.exports = admin 