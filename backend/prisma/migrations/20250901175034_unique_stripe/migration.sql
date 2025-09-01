/*
  Warnings:

  - A unique constraint covering the columns `[stripe_price_id]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plan_stripe_price_id_key" ON "public"."Plan"("stripe_price_id");
