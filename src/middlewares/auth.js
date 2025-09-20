const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { CustomError, catchAsync } = require("./errorHandler");

const authToken = catchAsync(async (req, res, next) => {
  // Obtener token del Auth Bearer
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new CustomError("Usuario no autenticado", 401));
  }

  // Validar el token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new CustomError("Token invalido", 401));
  }

  // Obtener usuario por su id
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(new CustomError("Usuario no autenticado", 401)); // Aunque no exista ("seguridad")
  }

  req.user = currentUser;
  next();
});

const isAdmin = () => {
  return (req, res, next) => {
    if (req.user.role == "admin") {
      return next(new CustomError("Usuario no autorizado para realizar esta acción", 403));
    }
    next();
  };
};

module.exports = { authToken, isAdmin };
