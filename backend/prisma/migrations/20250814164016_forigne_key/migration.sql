/*
  Warnings:

  - Added the required column `restaurant_id` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."carts" ADD COLUMN     "restaurant_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
