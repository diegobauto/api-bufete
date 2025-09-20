const express = require("express");
const { authToken } = require("../middlewares/auth");
const { validate, schemas } = require("../middlewares/validation");
const LawyerController = require("../controllers/LawyerController");

const router = express.Router();
router.use(authToken); // Middleware autenticación

// Rutas
router.post("/", validate(schemas.createLawyer), LawyerController.crearAbogado);
router.get("/", LawyerController.obtenerAbogados);
router.get("/:id", LawyerController.obtenerAbogado);

module.exports = router;
