export default (sequelize, DATA_TYPES) => {
  return sequelize.define("Content", {
    content: DATA_TYPES.TEXT,
    id: {
      primaryKey: true,
      type: DATA_TYPES.STRING,
    },
    path: DATA_TYPES.STRING,
  }, {});
};
