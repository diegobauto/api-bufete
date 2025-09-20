const { date } = require("joi");
const logger = require("../utils/logger");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Datos invalidos
const errorDatosInvalidos = (err) => {
  const message = `Valor invalido: ${err.path}: ${err.value}`;
  return new CustomError(message, 400);
};

// Validación de datos (schemas)
const errorDatosInvalidosDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Datos invalidos: ${errors.join(". ")}`;
  return new CustomError(message, 400);
};

const errorCamposDuplicados = (err) => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : "";
  const message = `Campo duplicado: ${value}`;
  return new CustomError(message, 400);
};

const errorToken = () => new CustomError("Token invalido", 401);
const errorTokenExp = () => new CustomError("Token expirado", 401);

const mostrarError = (err, res) => {
  // Error operativo (confiable)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.statusCode,
      message: err.message,
      data: null,
    });
  } else {
    // Error de programación (no mostrar al usuario)
    logger.error("ERROR:", err);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error interno del servidor",
      data: null,
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log del error
  logger.error(
    `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  let error = { ...err };
  error.message = err.message;

  if (error.name === "CastError") error = errorDatosInvalidos(error);
  if (error.code === 11000) error = errorCamposDuplicados(error);
  if (error.name === "ValidationError") error = errorDatosInvalidosDB(error);
  if (error.name === "JsonWebTokenError") error = errorToken();
  if (error.name === "TokenExpiredError") error = errorTokenExp();

  mostrarError(error, res);
};

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = { CustomError, errorHandler, catchAsync };
