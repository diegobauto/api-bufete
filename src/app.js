require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const logger = require("./utils/logger");
const { errorHandler } = require("./middlewares/errorHandler");

const authRoutes = require("./routes/auth");
const lawyerRoutes = require("./routes/lawyers");
const lawsuitRoutes = require("./routes/lawsuits");
const reportRoutes = require("./routes/reports");

//Inicialización
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Logs estructurados
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Rutas
app.use("/auth", authRoutes);
app.use("/lawyers", lawyerRoutes);
app.use("/lawsuits", lawsuitRoutes);
app.use("/reports", reportRoutes);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger en ruta inicial (solo por practicidad)

// Respuestas manejo de errores
app.use(errorHandler);

// Escucha
app.listen(PORT, () => {
  logger.info(`Servidor ejecutandose / http://localhost:${PORT}/`);
});

module.exports = app;
