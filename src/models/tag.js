export default (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      channelId: {
        allowNull: false,
        field: "channel_id",
        type: DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      color: {
        allowNull: false,
        type: DataTypes.STRING(20),
      },
      createdAt: {
        field: "created_at",
        type: "TIMESTAMP",
      },
      updatedAt: {
        field: "updated_at",
        type: "TIMESTAMP",
      },
    },
    {
      tableName: "tags",
      name: {
        singular: "tag",
        plural: "tags",
      },
    }
  );

  Tag.associate = function(models) {
    models.Tag.belongsToMany(models.Customer, {
      through: "CustomerTag",
    });
    models.Tag.belongsTo(models.User, {
      foreignKey: "creator",
    });
  };

  return Tag;
};
