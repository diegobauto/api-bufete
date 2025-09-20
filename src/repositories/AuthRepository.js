const { User } = require("../models");

class AuthRepository {
  async findUser(username) {
    return await User.findOne({ where: { username } });
  }

  async findById(id) {
    return await User.findByPk(id);
  }
}

module.exports = new AuthRepository();
