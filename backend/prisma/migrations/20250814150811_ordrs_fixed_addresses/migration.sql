/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `order_addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "order_addresses_order_id_key" ON "public"."order_addresses"("order_id");
