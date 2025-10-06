const LawsuitService = require("../services/LawsuitService");
const { catchAsync } = require("../middlewares/errorHandler");

class LawsuitController {
  /**
   * @swagger
   * /lawsuits:
   *   post:
   *     tags:
   *       - Demanda (Lawsuit)
   *     summary: Crear una demanda
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LawsuitInput'
   *     responses:
   *       201:
   *         description: Demanda creada exitosamente
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
   *                   example: Demanda creada exitosamente
   *                 data:
   *                   type: object
   *                   $ref: '#/components/schemas/Lawsuit'
   *       400:
   *         description: El número de caso ya existe
   */
  crearDemanda = catchAsync(async (req, res) => {
    const demanda = await LawsuitService.crearDemanda(req.body, req.user);
    res.status(201).json({
      status: 201,
      success: true,
      message: "Demanda creada exitosamente",
      data: demanda,
    });
  });

  /**
   * @swagger
   * /lawsuits:
   *   get:
   *     tags:
   *       - Demanda (Lawsuit)
   *     summary: Obtener lista de demandas
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, assigned, resolved]
   *         description: Filtrar por estado de demanda
   *       - in: query
   *         name: lawyer_id
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filtrar por ID de abogado
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *     responses:
   *       200:
   *         description: Lista de demandas obtenida exitosamente
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
   *                   example: Lista de demandas obtenida exitosamente
   *                 data:
   *                   type: array
   *                   items:
   *                    $ref: '#/components/schemas/Lawsuit'
   *                 metadata:
   *                   type: any
   *                   example: {}
   */
  obtenerDemandas = catchAsync(async (req, res) => {
    const { lawsuits, metadata } = await LawsuitService.obtenerDemandas(
      req.parsedQuery
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Lista de demandas obtenida exitosamente",
      data: lawsuits,
      metadata: metadata,
    });
  });

  /**
   * @swagger
   * /lawsuits/{id}/assign:
   *   put:
   *     tags:
   *       - Demanda (Lawsuit)
   *     summary: Asignar abogado a una demanda
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la demanda 
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - lawyer_id
   *             properties:
   *               lawyer_id:
   *                 type: string
   *                 format: uuid
   *     responses:
   *       200:
   *         description: Asignación realizada exitosamente
   *       404:
   *         description: Abogado o demanda no encontrada
   *       400:
   *         description: El abogado se encuentra inactivo
   */
  asignarAbogado = catchAsync(async (req, res) => {
    const { lawyer_id } = req.body;
    const { id } = req.params;

    const demanda = await LawsuitService.asignarAbogado(
      id,
      lawyer_id,
      req.user
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Asignación realizada exitosamente",
      data: demanda,
    });
  });
}

module.exports = new LawsuitController();
