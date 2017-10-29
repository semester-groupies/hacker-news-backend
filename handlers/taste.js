
const bcrypt = require("bcryptjs");
module.exports={

    salt : bcrypt.genSaltSync(10),
    secret : "groupHsecret"
}
