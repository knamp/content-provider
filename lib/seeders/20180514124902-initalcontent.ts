module.exports = {
  up: (queryInterface, sequelize) => {
    return queryInterface.bulkInsert("Contents", [{
      content: `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Page Title</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
      <script src="main.js"></script></head><body></body></html>`,
      createdAt: sequelize.literal("NOW()"),
      id: "101000100101011",
      updatedAt: sequelize.literal("NOW()"),
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("Content", null, {});
  },
};
