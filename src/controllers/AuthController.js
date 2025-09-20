const AuthService = require("../services/AuthService");
const { catchAsync } = require("../middlewares/errorHandler");

class AuthController {
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags:
   *       - Autenticación
   *     summary: Inicio de sesión
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: admin
   *               password:
   *                 type: string
   *                 example: admin123
   *     responses:
   *       200:
   *         description: Inicio de sesión exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 200
   *                 token:
   *                   type: string
   *                 data:
   *                   type: object
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Credenciales invalidas
   */
  login = catchAsync(async (req, res) => {
    const { user, token } = await AuthService.iniciarSesion(req.body, req.user);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Inicio de sesión exitoso",
      data: user,
      metadata: { token },
    });
  });
}
module.exports = new AuthController();
