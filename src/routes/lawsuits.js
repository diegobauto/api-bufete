const express = require("express");
const { authToken } = require("../middlewares/auth");
const { validate, schemas } = require("../middlewares/validation");
const LawsuitController = require("../controllers/LawsuitController");
const parseQueryParams = require("../middlewares/queryParser");

const router = express.Router();
router.use(authToken); // Middleware autenticación

// Rutas
router.post("/", validate(schemas.createLawsuit), LawsuitController.crearDemanda);
router.get("/", parseQueryParams(), LawsuitController.obtenerDemandas);
router.put("/:id/assign", validate(schemas.assignLawyer), LawsuitController.asignarAbogado);

module.exports = router;
