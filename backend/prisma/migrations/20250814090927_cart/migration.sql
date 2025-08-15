/*
  Warnings:

  - A unique constraint covering the columns `[user_id,menu_id,variant_id]` on the table `carts` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `menu_id` on table `carts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."carts" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "menu_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_menu_id_variant_id_key" ON "public"."carts"("user_id", "menu_id", "variant_id");
