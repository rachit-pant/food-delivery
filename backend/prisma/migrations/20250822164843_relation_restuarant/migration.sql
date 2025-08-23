/*
  Warnings:

  - Made the column `restaurant_id` on table `restaurant_timings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."restaurant_timings" DROP CONSTRAINT "restaurant_timings_restaurant_id_fkey";

-- AlterTable
ALTER TABLE "public"."restaurant_timings" ALTER COLUMN "restaurant_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."restaurant_timings" ADD CONSTRAINT "restaurant_timings_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
