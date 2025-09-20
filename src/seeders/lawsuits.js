'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener abogados para asignar
    const lawyers = await queryInterface.sequelize.query(
      "SELECT id FROM lawyers WHERE status = 'active' LIMIT 3;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkInsert('lawsuits', [
      {
        id: uuidv4(),
        case_number: 'DEM-2025-001',
        plaintiff: 'Empresa XYZ',
        defendant: 'Juan Rodríguez',
        case_type: 'labor',
        status: 'pending',
        lawyer_id: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-002',
        plaintiff: 'Empresa ABC',
        defendant: 'Pepito Perez',
        case_type: 'criminal',
        status: 'assigned',
        lawyer_id: lawyers.length > 0 ? lawyers[0].id : null,
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lawsuits', null, {});
  }
};