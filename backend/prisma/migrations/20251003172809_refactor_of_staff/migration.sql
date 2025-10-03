/*
  Warnings:

  - You are about to drop the column `position` on the `FranchiseStaff` table. All the data in the column will be lost.
  - You are about to drop the column `staffRoleId` on the `staff` table. All the data in the column will be lost.
  - Added the required column `staffRoleId` to the `FranchiseStaff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."staff" DROP CONSTRAINT "staff_staffRoleId_fkey";

-- AlterTable
ALTER TABLE "public"."FranchiseStaff" DROP COLUMN "position",
ADD COLUMN     "staffRoleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."staff" DROP COLUMN "staffRoleId";

-- AddForeignKey
ALTER TABLE "public"."FranchiseStaff" ADD CONSTRAINT "FranchiseStaff_staffRoleId_fkey" FOREIGN KEY ("staffRoleId") REFERENCES "public"."StaffRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
