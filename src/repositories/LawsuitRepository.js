const { Lawsuit, Lawyer } = require("../models");
const BaseRepository = require("./BaseRepository");

class LawsuitRepository extends BaseRepository {
  constructor() {
    super(Lawsuit, ["case_number", "plaintiff_name", "defendant_name"]);
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

  async findAll(queryParams) {
    // Obtener todas las asociaciones del modelo automáticamente
    const associations = Object.keys(this.model.associations || {});

    // Construir includes dinámicamente basados en lo que se solicita
    const includeOptions = queryParams.include
      .filter((name) => associations.includes(name))
      .map((name) => ({
        association: name,
        required: false,
      }));

    return await this.findAllDynamic(queryParams, includeOptions);
  }
}

module.exports = new LawsuitRepository();
