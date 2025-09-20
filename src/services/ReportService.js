const { CustomError } = require("../middlewares/errorHandler");
const logger = require("../utils/logger");
const ReportRepository = require("../repositories/ReportRepository");

class ReportService {
  async listarDemandasPorAbogado(lawyerId, { status, page, limit }, user) {
    // Verificar abogado
    const lawyer = await ReportRepository.findLawyerById(lawyerId);
    if (!lawyer) throw new CustomError("El abogado no existe", 404);

    // Obtener demandas paginadas
    const { count, lawsuits } = await ReportRepository.findLawsuitsByLawyer({
      lawyer_id: lawyerId,
      status,
      page,
      limit,
    });

    // Obtener todas las demandas asignadas (opcional)
    const allLawsuits = await ReportRepository.findAllLawsuitsByLawyer(
      lawyerId
    );

    const totalPages = Math.ceil(count / limit);

    logger.info(
      `Listado de demandas por abogado ${lawyer.name} (${lawyerId}) - Por usuario: ${user.username}`
    );

    return {
      lawyer: { id: lawyer.id, name: lawyer.name },
      lawsuits,
      metadata: {
        currentPage: page,
        totalPages,
        totalItems: count,
        limit,
      },
    };
  }
}

module.exports = new ReportService();
