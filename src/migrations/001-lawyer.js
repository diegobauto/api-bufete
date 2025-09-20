'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lawyers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      specialization: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Indices
    await queryInterface.addIndex('lawyers', ['email'], {
      unique: true,
      name: 'lawyers_email_unique'
    });

    await queryInterface.addIndex('lawyers', ['status'], {
      name: 'lawyers_status_index'
    });

    await queryInterface.addIndex('lawyers', ['specialization'], {
      name: 'lawyers_specialization_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lawyers');
  }
};