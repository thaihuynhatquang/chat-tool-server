export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("threads", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        channelId: {
          allowNull: false,
          field: "channel_id",
          type: Sequelize.INTEGER,
        },
        uniqueKey: {
          allowNull: false,
          field: "unique_key",
          type: Sequelize.STRING,
        },
        title: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        status: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        additionData: {
          field: "addition_data",
          type: Sequelize.JSON,
        },
        missCount: {
          field: "miss_count",
          type: Sequelize.INTEGER,
        },
        missTime: {
          field: "miss_time",
          type: "TIMESTAMP",
        },
        lastMsgId: {
          field: "last_msg_id",
          type: Sequelize.STRING,
        },
        readAt: {
          field: "read_at",
          type: "TIMESTAMP",
        },
        createdAt: {
          field: "created_at",
          type: "TIMESTAMP",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          field: "updated_at",
          type: "TIMESTAMP",
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
        },
        deletedAt: {
          field: "deleted_at",
          type: "TIMESTAMP",
        },
      })
      .then(() =>
        queryInterface.addIndex("threads", {
          fields: ["status"],
        })
      )
      .then(() =>
        queryInterface.addIndex("threads", {
          fields: ["channel_id", "unique_key"],
          type: "UNIQUE",
        })
      );
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("threads");
  },
};
