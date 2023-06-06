"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("blooways", [
      {
        id: 1,
        name: "전체 블루웨이",
        link: "all",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert("areas", [
      {
        id: 1,
        name: "전체",
        secret: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        BloowayId: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
