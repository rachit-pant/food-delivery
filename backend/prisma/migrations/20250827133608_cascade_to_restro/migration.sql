-- DropForeignKey
ALTER TABLE "public"."menus" DROP CONSTRAINT "menus_restaurant_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."menus" ADD CONSTRAINT "menus_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
