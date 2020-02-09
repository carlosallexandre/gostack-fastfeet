module.exports = {
  up: queryInterface => {
    return Promise.all([
      queryInterface.dropTable('addresses'),
      queryInterface.dropTable('recipients'),
    ]);
  },
};
