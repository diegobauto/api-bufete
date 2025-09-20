const express = require("express");
const { authToken } = require("../middlewares/auth");
const ReportController = require("../controllers/ReportController");

const router = express.Router();
router.use(authToken); // Middleware autenticación

// Rutas
router.get("/lawyers/:id/lawsuits", ReportController.listarDemandasPorAbogado);

module.exports = router;
