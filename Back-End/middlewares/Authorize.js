//==================================== to check is he registered/logged in  or not ========================================/

const {User} = require("../Models/DB");



const authorized = async (req, res, next) => {
    try {
      const { token } = req.headers;
      const user = await User.findOne({ where: { token } });
      if (user) {
        next();
      } else {
        res.status(403).json({
          msg: "you are not authorized",
        });
      }
    } catch (err) {
      res.status(500).json({ err });
    }
  };

module.exports = authorized 