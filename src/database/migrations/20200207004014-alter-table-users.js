module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'avatar_id', Sequelize.INTEGER),
      queryInterface.addColumn(
        'users',
        'role',
        Sequelize.ENUM('admin', 'deliveryman', 'guest')
      ),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('users', 'avatar_id'),
      queryInterface.removeColumn('users', 'role'),
    ]);
  },
};
