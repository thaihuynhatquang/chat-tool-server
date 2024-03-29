export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("messages", {
      mid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      threadId: {
        allowNull: false,
        primaryKey: true,
        field: "thread_id",
        type: Sequelize.INTEGER,
      },
      customerId: {
        allowNull: false,
        field: "customer_id",
        type: Sequelize.INTEGER,
      },
      isVerified: {
        allowNull: false,
        field: "is_verified",
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        field: "user_id",
        type: Sequelize.INTEGER,
      },
      parentId: {
        field: "parent_id",
        type: Sequelize.STRING,
      },
      processed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      content: {
        type: Sequelize.STRING,
      },
      additionData: {
        field: "addition_data",
        type: Sequelize.JSON,
      },
      msgCreatedAt: {
        field: "msg_created_at",
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      msgUpdatedAt: {
        field: "msg_updated_at",
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
      msgDeletedAt: {
        field: "msg_deleted_at",
        type: "TIMESTAMP",
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("messages");
  },
};
