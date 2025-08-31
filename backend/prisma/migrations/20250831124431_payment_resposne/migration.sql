/*
  Warnings:

  - Changed the type of `paymentStatus` on the `Sub` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."payment_response" AS ENUM ('success', 'failed');

-- AlterTable
ALTER TABLE "public"."Sub" DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "public"."payment_response" NOT NULL;
