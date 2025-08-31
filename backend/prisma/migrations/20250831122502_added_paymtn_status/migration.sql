/*
  Warnings:

  - Added the required column `paymentStatus` to the `Sub` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Sub" ADD COLUMN     "paymentStatus" "public"."payment_status" NOT NULL;
