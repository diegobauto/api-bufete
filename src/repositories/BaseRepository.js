const { Op } = require("sequelize");

class BaseRepository {
  constructor(model, searchFields = []) {
    this.model = model;
    this.searchFields = searchFields;
  }

  /**
   * Método principal para obtener registros con búsqueda, filtros,
   * ordenamiento, paginación y asociaciones dinámicas.
   */
  async findAllDynamic(queryParams = {}, includeOptions = []) {
    try {
      const {
        pagination = { limit: 10, offset: 0, page: 1 },
        sortBy = "id",
        orderBy = "ASC",
        conditions = [],
        include = [],
        fields = [],
        search = "",
      } = queryParams;

      // Construir condiciones
      let whereConditions = this.buildWhereConditions(conditions);

      // Búsqueda global
      if (search && search.trim() && this.searchFields.length > 0) {
        whereConditions = this.applySearchToConditions(
          whereConditions,
          search.trim()
        );
      }

      const dynamicIncludes =
        includeOptions.length > 0
          ? includeOptions
          : this.buildIncludeOptions(queryParams);

      const queryConfig = {
        where: whereConditions,
        include: dynamicIncludes,
        distinct: true,
        subQuery: false,
      };

      // Ordenamiento
      queryConfig.order = this.buildOrderClause(sortBy, orderBy);

      // Paginación
      if (pagination.limit > 0) {
        queryConfig.limit = Math.min(pagination.limit, 1000);
        queryConfig.offset = Math.max(pagination.offset, 0);
      }

      // Campos específicos
      if (fields.length > 0) {
        queryConfig.attributes = this.sanitizeFields(fields);
      }

      const { count, rows } = await this.model.findAndCountAll(queryConfig);

      return {
        data: rows || [],
        metadata: {
          limit: queryConfig.limit || count,
          offset: queryConfig.offset || 0,
          total: count,
          currentPage: pagination.page,
          totalPages: queryConfig.limit
            ? Math.ceil(count / queryConfig.limit)
            : 1,
        },
      };
    } catch (error) {
      console.error("[BaseRepository] Error en findAllDynamic:", error);
      return {
        data: [],
        metadata: {
          limit: queryParams.pagination?.limit || 10,
          offset: queryParams.pagination?.offset || 0,
          total: 0,
          currentPage: queryParams.pagination?.page || 1,
          totalPages: 0,
        },
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Query failed",
      };
    }
  }

  /**
   * Construye automáticamente los include a partir de las asociaciones
   * definidas en el modelo.
   */
  buildIncludeOptions(queryParams = {}) {
    const modelAssociations = Object.keys(this.model.associations || {});

    if (!Array.isArray(queryParams.include) || queryParams.include.length === 0)
      return [];

    return queryParams.include
      .filter((name) => modelAssociations.includes(name))
      .map((name) => ({
        association: name,
        required: false,
      }));
  }

  /** Construye las condiciones WHERE según operadores avanzados */
  buildWhereConditions(conditions) {
    const whereConditions = {};

    const operatorMap = {
      "=": Op.eq,
      "!=": Op.ne,
      ">": Op.gt,
      "<": Op.lt,
      ">=": Op.gte,
      "<=": Op.lte,
      like: Op.like,
      ilike: Op.iLike,
      in: Op.in,
      "not in": Op.notIn,
    };

    conditions.forEach(({ field, operator, value }) => {
      if (!field) return;

      const sequelizeOp = operatorMap[operator.toLowerCase?.()] || Op.eq;

      if (
        ["in", "not in"].includes(operator.toLowerCase?.()) &&
        typeof value === "string"
      ) {
        whereConditions[field] = {
          [sequelizeOp]: value.split(",").map((v) => v.trim()),
        };
        return;
      }

      if (
        ["in", "not in"].includes(operator.toLowerCase?.()) &&
        Array.isArray(value)
      ) {
        whereConditions[field] = { [sequelizeOp]: value };
        return;
      }

      if (
        ["like", "ilike"].includes(operator.toLowerCase?.()) &&
        typeof value === "string"
      ) {
        whereConditions[field] = { [sequelizeOp]: `%${value}%` };
        return;
      }

      whereConditions[field] = { [sequelizeOp]: value };
    });

    return whereConditions;
  }

  /** Construye la cláusula ORDER BY */
  buildOrderClause(sortBy, orderBy) {
    const validDirections = ["ASC", "DESC", "asc", "desc"];
    const direction = validDirections.includes(orderBy)
      ? orderBy.toUpperCase()
      : "ASC";

    if (Array.isArray(sortBy)) {
      return sortBy.map((field, idx) => [
        field,
        Array.isArray(orderBy)
          ? (orderBy[idx] || "ASC").toUpperCase()
          : direction,
      ]);
    }

    return [[sortBy || "id", direction]];
  }

  /** Limpia la lista de campos a seleccionar */
  sanitizeFields(fields) {
    return fields.filter(
      (field) => field && typeof field === "string" && field.trim().length > 0
    );
  }

  /** Aplica búsqueda global sobre múltiples campos */
  applySearchToConditions(whereConditions, searchTerm) {
    const searchConditions = this.searchFields.map((field) => ({
      [field]: { [Op.iLike]: `%${searchTerm}%` },
    }));

    if (Object.keys(whereConditions).length > 0) {
      return {
        [Op.and]: [whereConditions, { [Op.or]: searchConditions }],
      };
    }

    return { [Op.or]: searchConditions };
  }
}

module.exports = BaseRepository;