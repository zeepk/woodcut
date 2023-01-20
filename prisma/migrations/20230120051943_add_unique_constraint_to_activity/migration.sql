/*
  Warnings:

  - A unique constraint covering the columns `[playerId,occurred,text,details]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Activity_playerId_occurred_text_details_key` ON `Activity`(`playerId`, `occurred`, `text`, `details`);
