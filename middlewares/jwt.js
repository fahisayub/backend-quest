const jwt = require("jsonwebtoken");
require("dotenv").config();
async function jwtExtractor(jwtToken) {
 const t = jwt.verify(jwtToken, process.env.SecretKey, async function (err, decoded) {
    if (err) {
      console.log("error in jwt", err);
      return null;
    }

    if (decoded) {
      console.log("decode succesfully");
      return decoded;
    } else {
      console.log("please login");
      return null;
    }
  });
  return t;
}

module.exports = {
  jwtExtractor,
};
