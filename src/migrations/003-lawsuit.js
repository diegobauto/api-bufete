'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lawsuits', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      case_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      plaintiff: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      defendant: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      case_type: {
        type: Sequelize.ENUM('civil', 'criminal', 'labor', 'commercial'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'assigned', 'resolved'),
        allowNull: false,
        defaultValue: 'pending'
      },
      lawyer_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'lawyers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('lawsuits', ['case_number'], {
      unique: true,
      name: 'lawsuits_case_number_unique'
    });

    await queryInterface.addIndex('lawsuits', ['status'], {
      name: 'lawsuits_status_index'
    });

    await queryInterface.addIndex('lawsuits', ['case_type'], {
      name: 'lawsuits_case_type_index'
    });

    await queryInterface.addIndex('lawsuits', ['lawyer_id'], {
      name: 'lawsuits_lawyer_id_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lawsuits');
  }
};