const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API REST Bufete",
      version: "1.0.0",
      description:
        "API REST para la gestión de abogados y demandas en un bufete",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            username: {
              type: "string",
            },
            role: {
              type: "string",
              enum: ["admin", "operator"],
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Lawyer: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
            phone: {
              type: "string",
            },
            specialization: {
              type: "string",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        LawyerInput: {
          type: "object",
          required: ["name", "email", "phone", "specialization"],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
            },
            email: {
              type: "string",
              format: "email",
            },
            phone: {
              type: "string",
              pattern: "^[\\+]?[1-9][\\d]{0,15}$",
            },
            specialization: {
              type: "string",
              minLength: 2,
              maxLength: 50,
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              default: "active",
            },
          },
        },
        Lawsuit: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            case_number: {
              type: "string",
            },
            plaintiff: {
              type: "string",
            },
            defendant: {
              type: "string",
            },
            case_type: {
              type: "string",
              enum: ["civil", "criminal", "labor", "commercial"],
            },
            status: {
              type: "string",
              enum: ["pending", "assigned", "resolved"],
            },
            lawyer_id: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        LawsuitInput: {
          type: "object",
          required: ["case_number", "plaintiff", "defendant", "case_type"],
          properties: {
            case_number: {
              type: "string",
              minLength: 3,
              maxLength: 50,
            },
            plaintiff: {
              type: "string",
              minLength: 2,
              maxLength: 100,
            },
            defendant: {
              type: "string",
              minLength: 2,
              maxLength: 100,
            },
            case_type: {
              type: "string",
              enum: ["civil", "criminal", "labor", "commercial"],
            },
            status: {
              type: "string",
              enum: ["pending", "assigned", "resolved"],
              default: "pending",
            },
          },
        },
        // Error: {
        //   type: "object",
        //   properties: {
        //     status: {
        //       type: "string",
        //     },
        //     message: {
        //       type: "string",
        //     },
        //   },
        // },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/controllers/*.js"],
};

module.exports = swaggerJsdoc(options);
