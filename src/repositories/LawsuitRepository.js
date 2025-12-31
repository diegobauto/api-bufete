const { Lawsuit, Lawyer } = require("../models");
const BaseRepository = require("./BaseRepository");

class LawsuitRepository extends BaseRepository {
  constructor() {
    // IMPORTANTE: Los campos de busqueda no deben ser ENUMs
    super(Lawsuit, ["case_number", "plaintiff"]);
  }

  async create(lawsuitData) {
    return await Lawsuit.create(lawsuitData);
  }

  async update(lawsuit, data) {
    return await lawsuit.update(data);
  }

  async findOne(case_number) {
    return await Lawsuit.findOne({
      where: { case_number: case_number },
    });
  }

  async findAll(queryParams) {
    // Puedo pasar los include que quiere desde el inicio (opcional)
    // return await this.findAllDynamic(queryParams, ["lawyer"]);

    return await this.findAllDynamic(queryParams);
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
}

module.exports = new LawsuitRepository();
