const express = require("express");
const { validate, schemas } = require("../middlewares/validation");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

// Rutas
router.post("/login", validate(schemas.login), AuthController.login);

module.exports = router;
