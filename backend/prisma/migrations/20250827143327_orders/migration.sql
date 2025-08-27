-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_restaurant_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
