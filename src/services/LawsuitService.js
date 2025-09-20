const { CustomError } = require("../middlewares/errorHandler");
const logger = require("../utils/logger");
const LawsuitRepository = require("../repositories/LawsuitRepository");
const LawyerRepository = require("../repositories/LawyerRepository");

class LawsuitService {
  async crearDemanda(lawsuitData, user) {
    // Verificar si el número de caso ya existe
    const exists = await LawsuitRepository.findOne(lawsuitData.case_number);
    if (exists) {
      throw new CustomError("El número de caso ya existe", 400);
    }

    // Crear demanda
    const lawsuit = await LawsuitRepository.create(lawsuitData);

    logger.info(
      `Demanda creada: ${lawsuit.case_number} (${lawsuit.id}) - Por usuario: ${user.username}`
    );

    return lawsuit;
  }

  async obtenerDemandas(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const { status, lawyer_id } = query;

    const { count, lawsuits } = await LawsuitRepository.findAllPaginated({
      page,
      limit,
      status,
      lawyer_id,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      lawsuits,
      metadata: {
        currentPage: page,
        totalPages,
        totalItems: count,
        limit,
      },
    };
  }

  async asignarAbogado(lawsuitId, lawyerId, user) {
    // Verificar si la demanda y el abogado existe
    const [lawsuit, lawyer] = await Promise.all([
      LawsuitRepository.findById(lawsuitId),
      LawyerRepository.findById(lawyerId),
    ]);
    if (!lawsuit) throw new CustomError("La demanda no existe", 404);
    if (!lawyer) throw new CustomError("El abogado no existe", 404);

    // Verificar estado del abogado
    if (lawyer.status !== "active")
      throw new CustomError("El abogado se encuentra inactivo", 400);

    // Actualizar estado de la demanda
    await LawsuitRepository.update(lawsuit, {
      lawyer_id: lawyerId,
      status: "assigned",
    });

    // Obtener demanda actualizada con información del abogado
    const updatedLawsuit = await LawsuitRepository.findById(lawsuit.id, {
      includeLawyer: true,
    });

    logger.info(
      `Demanda ${lawsuit.case_number} asignada al abogado ${lawyer.name} - Por usuario: ${user.username}`
    );

    return updatedLawsuit;
  }
}

module.exports = new LawsuitService();
