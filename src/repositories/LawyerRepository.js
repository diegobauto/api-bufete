const { Lawyer } = require("../models");

class LawyerRepository {
  async create(lawyerData) {
    return await Lawyer.create(lawyerData);
  }

  async findById(id) {
    return await Lawyer.findByPk(id);
  }

  async findAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { count, rows: lawyers } = await Lawyer.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });
    return { count, lawyers };
  }

  async findByEmail(email) {
    return await Lawyer.findOne({ where: { email } });
  }
}

module.exports = new LawyerRepository();
