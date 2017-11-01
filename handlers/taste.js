
const bcrypt = require("bcryptjs");
module.exports={

    salt : bcrypt.genSaltSync(1),
    secret : 'groupHsecret'
}
