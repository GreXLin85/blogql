'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    for (let index = 0; index < 6; index++) {
      await queryInterface.bulkInsert('users', [
        {
          username: 'user' + index,
          password: '123456',
          createdAt: new Date(),
          updatedAt: new Date()
        }], {})
      for (let i = 0; i < 2; i++) {
        await queryInterface.bulkInsert('posts', [
          {
            title: 'Nice post V' + i,
            description: 'Nice desc',
            createdBy: index + 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }], {})
        for (let f = 0; f < 2; f++) {
          await queryInterface.bulkInsert('comments', [
            {
              text: 'Nice comment V' + f,
              postId: i + 1,
              createdBy: index + 1,
              createdAt: new Date(),
              updatedAt: new Date()
            }], {})
        }
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
