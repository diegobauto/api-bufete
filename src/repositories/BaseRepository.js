const { Op } = require('sequelize');

class BaseRepository {
  constructor(model, searchFields = []) {
    this.model = model;
    this.searchFields = searchFields;
  }

  async findAllDynamic(queryParams, includeOptions = []) {
    try {
      const { pagination, sortBy, orderBy, conditions, filters, include, fields } = queryParams;
      
      // Construir WHERE con operadores avanzados
      const whereConditions = this.buildWhereConditions(conditions, filters);
      
      // Configuración de búsqueda
      const queryConfig = {
        where: whereConditions,
        include: includeOptions,
        order: [[sortBy, orderBy]],
        limit: pagination.limit,
        offset: pagination.offset,
        distinct: true
      };
      
      // Aplicar selección de campos si se especifica
      if (fields.length > 0) {
        queryConfig.attributes = fields;
      }

      const { count, rows } = await this.model.findAndCountAll(queryConfig);

      return {
        data: rows || [],
        metadata: {
          limit: pagination.limit,
          offset: pagination.offset,
          total: count,
          currentPage: pagination.page,
          totalPages: count > 0 ? Math.ceil(count / pagination.limit) : 0
        }
      };
    } catch (error) {
      // Si es cualquier error de DB, retornar lista vacía
      console.error('Error en query, retornando lista vacía:', error.message);
      
      return {
        data: [],
        metadata: {
          limit: queryParams.pagination.limit,
          offset: queryParams.pagination.offset,
          total: 0,
          currentPage: queryParams.pagination.page,
          totalPages: 0
        }
      };
    }
  }

  buildWhereConditions(conditions, filters) {
    const whereConditions = {};
    
    // Aplicar condiciones con operadores
    conditions.forEach(condition => {
      const { field, operator, value } = condition;
      
      // Manejar NULL
      if (value === null) {
        if (operator === '=') {
          whereConditions[field] = { [Op.is]: null };
        } else if (operator === '!=') {
          whereConditions[field] = { [Op.not]: null };
        }
        return;
      }
      
      // Mapear operadores
      const operatorMap = {
        '=': Op.eq,
        '!=': Op.ne,
        '>': Op.gt,
        '<': Op.lt,
        '>=': Op.gte,
        '<=': Op.lte
      };
      
      const sequelizeOp = operatorMap[operator] || Op.eq;
      whereConditions[field] = { [sequelizeOp]: value };
    });
    
    // Aplicar filtros simples (compatibilidad)
    Object.keys(filters).forEach(key => {
      if (!whereConditions[key]) {
        whereConditions[key] = filters[key];
      }
    });

    return whereConditions;
  }
}

module.exports = BaseRepository;