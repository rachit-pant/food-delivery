/*
  Warnings:

  - The values [success,failed] on the enum `payment_response` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."payment_response_new" AS ENUM ('draft', 'open', 'paid', 'uncollectible', 'void');
ALTER TABLE "public"."Sub" ALTER COLUMN "paymentStatus" TYPE "public"."payment_response_new" USING ("paymentStatus"::text::"public"."payment_response_new");
ALTER TYPE "public"."payment_response" RENAME TO "payment_response_old";
ALTER TYPE "public"."payment_response_new" RENAME TO "payment_response";
DROP TYPE "public"."payment_response_old";
COMMIT;
