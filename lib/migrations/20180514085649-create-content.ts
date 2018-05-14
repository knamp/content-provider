export default {
  down: (queryInterface) => {
    return queryInterface.dropTable("Contents");
  },
  up: (queryInterface, sequelize) => {
    return queryInterface.createTable("Contents", {
      content: {
        type: sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: sequelize.DATE,
      },
      id: {
        allowNull: false,
        primaryKey: true,
        type: sequelize.STRING,
      },
      updatedAt: {
        allowNull: false,
        type: sequelize.DATE,
      },
    });
  },
};
