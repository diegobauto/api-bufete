const parseQueryParams = () => {
  return (req, res, next) => {
    const {
      page = 1,
      limit = 10,
      offset,
      sortBy = 'created_at',
      orderBy = 'DESC',
      include,
      fields,
      query,
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
      orderBy: ['ASC', 'DESC'].includes(orderBy.toUpperCase()) ? orderBy.toUpperCase() : 'DESC',
      include: include ? parseInclude(include) : [],
      fields: fields ? fields.split(',').map(f => f.trim()) : [],
      conditions: query ? parseQueryConditions(query) : [],
      filters: filters
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

// Parsear condiciones: "name:Juan,age>25,price<100,active:true,description:null"
function parseQueryConditions(rawQuery) {
  const conditions = [];
  
  // Regex para capturar: field:value, field>value, field<value, etc.
  const regex = /(\w+)(<=|>=|!=|<|>|:)"?([^",]*)"?/g;
  
  // Dividir por comas respetando comillas
  const parts = splitRespectingQuotes(rawQuery, ',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    const match = regex.exec(trimmed);
    if (match) {
      const field = match[1];
      let operator = match[2];
      const value = match[3];
      
      // Convertir : a =
      if (operator === ':') operator = '=';
      
      conditions.push({
        field,
        operator,
        value: parseValue(value)
      });
    }
    
    // Resetear el índice del regex
    regex.lastIndex = 0;
  }
  
  return conditions;
}

// Dividir string respetando comillas
function splitRespectingQuotes(str, delimiter) {
  const parts = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === delimiter && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current) {
    parts.push(current);
  }
  
  return parts;
}

// Parsear valores (null, boolean, number, string)
function parseValue(value) {
  // null
  if (value.toLowerCase() === 'null') {
    return null;
  }
  
  // boolean
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  
  // number
  const num = Number(value);
  if (!isNaN(num) && value !== '') {
    return num;
  }
  
  // string (remover comillas)
  return value.replace(/^["']|["']$/g, '');
}

module.exports = parseQueryParams;