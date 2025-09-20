const ReportService = require("../services/ReportService");
const { catchAsync } = require("../middlewares/errorHandler");

class ReportController {
  /**
   * @swagger
   * /api/reports/lawyers/{id}/lawsuits:
   *   get:
   *     tags:
   *       - Reportes
   *     summary: Obtener el listado de demandas por abogado
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
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, assigned, resolved]
   *         description: Filtrar por el estado del abogado
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
   *         description: Listado de demandas obtenido exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: object
   *                   properties:
   *                     lawyer:
   *                       $ref: '#/components/schemas/Lawyer'
   *                     lawsuits:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Lawsuit'
   *       404:
   *         description: El abogado no existe
   */
  listarDemandasPorAbogado = catchAsync(async (req, res) => {
    const lawyerId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status } = req.query;

    const demandas = await ReportService.listarDemandasPorAbogado(
      lawyerId,
      { status, page, limit },
      req.user
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Listado de demandas obtenido exitosamente",
      data: demandas,
    });
  });
}
module.exports = new ReportController();
