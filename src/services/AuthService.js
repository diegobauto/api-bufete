const AuthRepository = require("../repositories/AuthRepository");
const { CustomError } = require("../middlewares/errorHandler");
const { crearToken } = require("../utils/auth");
const logger = require("../utils/logger");

class AuthService {
  async iniciarSesion(authData) {
    const { username, password } = authData;

    //Obtener usuario por su username
    const user = await AuthRepository.findUser(username);

    // Verificar usuario y contraseña
    if (!user || !(await user.comparePassword(password))) {
      logger.warn(`Login fallido por el usuario: ${username}`);
      return next(new CustomError("Credenciales invalidas", 401));
    }

    logger.info(`Usuario ${username} inició sesión exitosamente`);

    const token = crearToken(user.id);
    return { user, token };
  }
}

module.exports = new AuthService();
