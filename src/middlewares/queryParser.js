const parseQueryParams = () => {
  return (req, res, next) => {
    const {
      page = 1,
      limit = 10,
      offset,
      sortBy = 'updated_at',
      orderBy = 'DESC',
      include,
      fields,
      search, // Parámetro de búsqueda global
      ...filters
    } = req.query;

    // Normalizar limit
    let normalizedLimit = parseInt(limit);
    if (normalizedLimit < 0) normalizedLimit = 10;
    if (normalizedLimit > 100 && normalizedLimit !== 0) normalizedLimit = 100;

    // Calcular offset
    const calculatedOffset = offset !== undefined
      ? Math.max(0, parseInt(offset))
      : (parseInt(page) - 1) * normalizedLimit;

    req.parsedQuery = {
      pagination: {
        page: parseInt(page),
        limit: normalizedLimit,
        offset: calculatedOffset
      },
      sortBy: sortBy,
      orderBy: ['ASC', 'DESC'].includes(orderBy.toUpperCase()) 
        ? orderBy.toUpperCase() 
        : 'DESC',
      include: include ? parseInclude(include) : [],
      fields: fields ? fields.split(',').map(f => f.trim()) : [],
      conditions: parseFiltersToConditions(filters),
      filters: filters,
      search: search ? search.trim() : ''
    };

    next();
  };
};

// Parsear includes: "lawyer,client" -> ["lawyer", "client"]
function parseInclude(include) {
  return include.split(',')
    .map(inc => inc.trim())
    .filter(inc => inc !== '');
}

// Parsear filtros directos de URL a conditions
// Cada parámetro puede ser: campo=valor, campo>valor, campo<valor, etc.
function parseFiltersToConditions(filters) {
  const conditions = [];

  for (let [key, value] of Object.entries(filters)) {
    if (!key || value === undefined) continue;

    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    if (trimmedValue === '') continue;

    // Detectar si el key termina con ! (para manejar campo!=valor)
    // Esto sucede porque Express parsea ?campo!=valor como key="campo!" y value="valor"
    if (key.endsWith('!')) {
      key = key.slice(0, -1); // Remover el ! del campo
      // Agregar != al inicio del valor
      value = '!=' + trimmedValue;
    }

    // Regex para detectar operador al inicio del valor
    // Soporta: <=, >=, !=, <, >, = (o sin operador que es =)
    const operatorMatch = value.toString().match(/^(<=|>=|!=|<|>|=)?(.*)$/);
    
    if (operatorMatch) {
      let operator = operatorMatch[1] || '='; // Si no hay operador, usar =
      let actualValue = operatorMatch[2].trim();

      // Convertir : a = (por compatibilidad)
      if (operator === ':') operator = '=';

      // Detectar operadores especiales por sufijo del field
      // Soportar IN: category[in]=electronics,books
      if (key.endsWith('[in]')) {
        const cleanField = key.replace('[in]', '');
        conditions.push({
          field: cleanField,
          operator: 'in',
          value: actualValue.split(',').map(v => parseValue(v.trim()))
        });
        continue;
      }

      // Soportar NOT IN: category[not_in]=banned,spam
      if (key.endsWith('[not_in]')) {
        const cleanField = key.replace('[not_in]', '');
        conditions.push({
          field: cleanField,
          operator: 'not in',
          value: actualValue.split(',').map(v => parseValue(v.trim()))
        });
        continue;
      }

      // Soportar LIKE: name[like]=John
      if (key.endsWith('[like]')) {
        const cleanField = key.replace('[like]', '');
        conditions.push({
          field: cleanField,
          operator: 'like',
          value: parseValue(actualValue)
        });
        continue;
      }

      // Soportar ILIKE: name[ilike]=john
      if (key.endsWith('[ilike]')) {
        const cleanField = key.replace('[ilike]', '');
        conditions.push({
          field: cleanField,
          operator: 'ilike',
          value: parseValue(actualValue)
        });
        continue;
      }

      conditions.push({
        field: key,
        operator: operator,
        value: parseValue(actualValue)
      });
    }
  }

  return conditions;
}

// Parsear valores (null, boolean, number, string)
function parseValue(value) {
  if (!value || value === '') return '';

  // Limpiar comillas si existen
  const cleaned = value.toString().replace(/^["']|["']$/g, '').trim();

  // null
  if (cleaned.toLowerCase() === 'null') {
    return null;
  }

  // boolean
  if (cleaned.toLowerCase() === 'true') return true;
  if (cleaned.toLowerCase() === 'false') return false;

  // number (solo si es completamente numérico)
  if (/^-?\d+\.?\d*$/.test(cleaned)) {
    const num = Number(cleaned);
    if (!isNaN(num)) {
      return num;
    }
  }

  // string
  return cleaned;
}

module.exports = parseQueryParams;