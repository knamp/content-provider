export default {
  down: (queryInterface) => {
    return queryInterface.removeColumn("Contents", "path");
  },
  up: (queryInterface, sequelize) => {
    return queryInterface.addColumn("Contents", "path", sequelize.TEXT);
  },
};
