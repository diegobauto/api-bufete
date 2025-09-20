const { Lawyer, Lawsuit } = require("../models");

class ReportRepository {
  async findLawyerById(id) {
    return await Lawyer.findByPk(id);
  }

  async findLawsuitsByLawyer({ lawyer_id, status, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const where = { lawyer_id };
    if (status) where.status = status;

    const { count, rows: lawsuits } = await Lawsuit.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      attributes: ["id", "case_number", "status"],
    });

    return { count, lawsuits };
  }

  async findAllLawsuitsByLawyer(lawyer_id) {
    return await Lawsuit.findAll({
      where: { lawyer_id },
      attributes: ["status"],
    });
  }
}

module.exports = new ReportRepository();
