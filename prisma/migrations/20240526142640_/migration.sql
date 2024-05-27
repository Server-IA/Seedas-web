/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `externalId` VARCHAR(191) NOT NULL,
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_externalId_key` ON `User`(`externalId`);
