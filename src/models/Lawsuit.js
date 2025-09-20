const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Lawsuit = sequelize.define('Lawsuit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    case_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    plaintiff: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    defendant: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    case_type: {
      type: DataTypes.ENUM('civil', 'criminal', 'labor', 'commercial'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'assigned', 'resolved'),
      allowNull: false,
      defaultValue: 'pending'
    },
    lawyer_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'lawyers',
        key: 'id'
      }
    }
  }, {
    tableName: 'lawsuits',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['case_number']
      },
      {
        fields: ['status']
      },
      {
        fields: ['case_type']
      },
      {
        fields: ['lawyer_id']
      }
    ]
  });

  Lawsuit.associate = function(models) {
    Lawsuit.belongsTo(models.Lawyer, {
      foreignKey: 'lawyer_id',
      as: 'lawyer'
    });
  };

  return Lawsuit;
};