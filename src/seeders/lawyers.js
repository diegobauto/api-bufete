'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('lawyers', [
      {
        id: uuidv4(),
        name: 'Carlos Pérez',
        email: 'carlos.perez@example.com',
        phone: '3001234567',
        specialization: 'Laboral',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Juana Gonzales',
        email: 'juanita@example.com',
        phone: '3221111111',
        specialization: 'Laboral',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lawyers', null, {});
  }
};