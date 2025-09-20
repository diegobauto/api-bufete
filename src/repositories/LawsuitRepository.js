const { Lawsuit, Lawyer } = require("../models");

class LawsuitRepository {
  async create(lawyerData) {
    return await Lawsuit.create(lawyerData);
  }

  async update(lawsuit, data) {
    return await lawsuit.update(data);
  }

  async findOne(case_number) {
    return await Lawsuit.findOne({
      where: { case_number: case_number },
    });
  }

  async findById(id, options = {}) {
    const includeOptions = options.includeLawyer
      ? [
          {
            model: Lawyer,
            as: "lawyer",
            attributes: options.lawyerAttributes || [
              "id",
              "name",
              "email",
              "specialization",
            ],
          },
        ]
      : [];

    return await Lawsuit.findByPk(id, {
      include: includeOptions,
    });
  }

  async findAllPaginated({ page = 1, limit = 10, status, lawyer_id }) {
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (lawyer_id) where.lawyer_id = lawyer_id;

    const { count, rows: lawsuits } = await Lawsuit.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return { count, lawsuits };
  }
}

module.exports = new LawsuitRepository();
