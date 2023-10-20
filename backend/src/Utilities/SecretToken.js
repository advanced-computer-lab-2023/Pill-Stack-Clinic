require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id,role) => {
  console.log(process.env.TOKEN_KEY);
  return jwt.sign({ id:id,role:role }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};