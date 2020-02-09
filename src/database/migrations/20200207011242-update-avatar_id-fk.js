module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('users', ['avatar_id'], {
      type: 'foreign key',
      name: 'users_avatar_id_fkey',
      references: {
        table: 'files',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      'users',
      'users_avatar_id_fkey',
      Sequelize.INTEGER
    );
  },
};
