const { CustomError } = require("../middlewares/errorHandler");
const logger = require("../utils/logger");
const LawyerRepository = require("../repositories/LawyerRepository");

class LawyerService {
  async crearAbogado(lawyerData, user) {
    // Verificar si el email existe
    const existisEmail = await LawyerRepository.findByEmail(lawyerData.email);
    if (existisEmail) {
      throw new CustomError("El correo electronico ya esta en uso", 400);
    }

    // Crear abogado
    const lawyer = await LawyerRepository.create(lawyerData);

    logger.info(
      `Abogado creado: ${lawyer.name} (${lawyer.id}). Por usuario: ${user.username}`
    );

    return lawyer;
  }

  async obtenerAbogados(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const { count, lawyers } = await LawyerRepository.findAllPaginated(
      page,
      limit
    );
    const totalPages = Math.ceil(count / limit);

    return {
      lawyers,
      metadata: {
        currentPage: page,
        totalPages,
        totalItems: count,
        limit,
      },
    };
  }

  async obtenerAbogado(id) {
    // Verificar si el abogado existe
    const lawyer = await LawyerRepository.findById(id);
    if (!lawyer) {
      throw new CustomError("El abogado no existe", 404);
    }
    return lawyer;
  }
}

module.exports = new LawyerService();
