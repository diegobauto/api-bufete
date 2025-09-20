const express = require("express");
const { authToken } = require("../middlewares/auth");
const { validate, schemas } = require("../middlewares/validation");
const LawsuitController = require("../controllers/LawsuitController");

const router = express.Router();
router.use(authToken); // Middleware autenticación

// Rutas
router.post("/", validate(schemas.createLawsuit), LawsuitController.crearDemanda);
router.get("/", LawsuitController.obtenerDemandas);
router.put("/:id/assign", validate(schemas.assignLawyer), LawsuitController.asignarAbogado);

module.exports = router;
