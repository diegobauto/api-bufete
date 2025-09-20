const LawyerService = require("../services/LawyerService");
const { catchAsync } = require("../middlewares/errorHandler");

class LawyerController {
  /**
   * @swagger
   * /lawyers:
   *   post:
   *     tags:
   *       - Abogado (Lawyer)
   *     summary: Crear un abogado
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LawyerInput'
   *     responses:
   *       201:
   *         description: Abogado creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 201
   *                 success:
   *                   type: bool
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Abogado creado exitosamente
   *                 data:
   *                   type: object
   *                   $ref: '#/components/schemas/Lawyer'
   *       400:
   *         description: El correo electronico ya esta en uso
   */
  crearAbogado = catchAsync(async (req, res) => {
    const abogado = await LawyerService.crearAbogado(req.body, req.user);
    res.status(201).json({
      status: 201,
      success: true,
      message: "Abogado creado exitosamente",
      data: abogado,
    });
  });

  /**
   * @swagger
   * /lawyers:
   *   get:
   *     tags:
   *       - Abogado (Lawyer)
   *     summary: Obtener lista de abogados (paginado)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Numero de pagina
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Número de registros por pagina
   *     responses:
   *       200:
   *         description: Lista de abogados obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 200
   *                 success:
   *                   type: bool
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Lista de abogados obtenida exitosamente
   *                 data:
   *                   type: array
   *                   items:
   *                      $ref: '#/components/schemas/Lawyer'
   *                 metadata:
   *                   type: any
   *                   example: {}
   */
  obtenerAbogados = catchAsync(async (req, res) => {
    const { lawyers, metadata } = await LawyerService.obtenerAbogados(
      req.query
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Lista de abogados obtenida exitosamente",
      data: lawyers,
      metadata: metadata,
    });
  });

  /**
   * @swagger
   * /lawyers/{id}:
   *   get:
   *     tags:
   *       - Abogado (Lawyer)
   *     summary: Obtener un abogado por su ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del abogado
   *     responses:
   *       200:
   *         description: Abogado obtenido exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 200
   *                 success:
   *                   type: bool
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Abogado obtenido exitosamente
   *                 data:
   *                   type: object
   *                   $ref: '#/components/schemas/Lawyer'
   *       404:
   *         description: Abogado no encontrado
   */
  obtenerAbogado = catchAsync(async (req, res) => {
    const abogado = await LawyerService.obtenerAbogado(req.params.id);
    res.status(201).json({
      status: 201,
      success: true,
      message: "Abogado obtenido exitosamente",
      data: abogado,
    });
  });
}

module.exports = new LawyerController();
