const Joi = require("joi");
const { CustomError } = require("./errorHandler");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(new CustomError(errorMessage, 400));
    }
    next();
  };
};

const schemas = {
  login: Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "El nombre de usuario es obligatorio",
      "any.required": "El nombre de usuario es obligatorio",
    }),
    password: Joi.string().required().messages({
      "string.empty": "La contraseña es obligatoria",
      "any.required": "La contraseña es obligatoria",
    }),
  }),

  createLawyer: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "El nombre debe tener al menos 2 caracteres",
      "string.max": "El nombre no puede exceder los 100 caracteres",
      "any.required": "El nombre es obligatorio",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Ingresa un correo electrónico válido",
      "any.required": "El correo electrónico es obligatorio",
    }),
    phone: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Ingresa un número de teléfono válido",
        "any.required": "El teléfono es obligatorio",
      }),
    specialization: Joi.string().min(2).max(50).required().messages({
      "string.min": "La especialización debe tener al menos 2 caracteres",
      "string.max": "La especialización no puede exceder los 50 caracteres",
      "any.required": "La especialización es obligatoria",
    }),
    status: Joi.string().valid("active", "inactive").default("active"),
  }),

  createLawsuit: Joi.object({
    case_number: Joi.string().min(3).max(50).required().messages({
      "string.min": "El número de caso debe tener al menos 3 caracteres",
      "string.max": "El número de caso no puede exceder los 50 caracteres",
      "any.required": "El número de caso es obligatorio",
    }),
    plaintiff: Joi.string().min(2).max(100).required().messages({
      "string.min": "El nombre del demandante debe tener al menos 2 caracteres",
      "string.max":
        "El nombre del demandante no puede exceder los 100 caracteres",
      "any.required": "El demandante es obligatorio",
    }),
    defendant: Joi.string().min(2).max(100).required().messages({
      "string.min": "El nombre del demandado debe tener al menos 2 caracteres",
      "string.max":
        "El nombre del demandado no puede exceder los 100 caracteres",
      "any.required": "El demandado es obligatorio",
    }),
    case_type: Joi.string()
      .valid("civil", "criminal", "labor", "commercial")
      .required()
      .messages({
        "any.only":
          "El tipo de caso debe ser uno de: civil, criminal, laboral, comercial",
        "any.required": "El tipo de caso es obligatorio",
      }),
    status: Joi.string()
      .valid("pending", "assigned", "resolved")
      .default("pending"),
    lawyer_id: Joi.string().uuid().allow(null),
  }),

  assignLawyer: Joi.object({
    lawyer_id: Joi.string().uuid().required().messages({
      "string.guid": "El ID del abogado debe ser un UUID válido",
      "any.required": "El ID del abogado es obligatorio",
    }),
  }),

  queryParams: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid("pending", "assigned", "resolved"),
    lawyer_id: Joi.string().uuid(),
  }),
};

module.exports = { validate, schemas };
