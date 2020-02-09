module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('recipients', 'street'),
      queryInterface.removeColumn('recipients', 'number'),
      queryInterface.removeColumn('recipients', 'complement'),
      queryInterface.removeColumn('recipients', 'state'),
      queryInterface.removeColumn('recipients', 'city'),
      queryInterface.removeColumn('recipients', 'zipcode'),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('recipients', 'street', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn('recipients', 'number', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('recipients', 'complement', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('recipients', 'state', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn('recipients', 'city', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn('recipients', 'zipcode', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
    ]);
  },
};
