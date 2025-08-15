/*
  Warnings:

  - A unique constraint covering the columns `[role_name]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_name` to the `user_roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_roles" DROP COLUMN "role_name",
ADD COLUMN     "role_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_role_name_key" ON "user_roles"("role_name");
