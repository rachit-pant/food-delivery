/*
  Warnings:

  - A unique constraint covering the columns `[stripe_subscription_id]` on the table `Sub` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sub_stripe_subscription_id_key" ON "public"."Sub"("stripe_subscription_id");
