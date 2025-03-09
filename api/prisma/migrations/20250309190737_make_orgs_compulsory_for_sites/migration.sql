/*
  Warnings:

  - Made the column `organisationId` on table `Site` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_organisationId_fkey";

-- AlterTable
ALTER TABLE "Site" ALTER COLUMN "organisationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
