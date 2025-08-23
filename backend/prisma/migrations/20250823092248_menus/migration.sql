-- DropForeignKey
ALTER TABLE "public"."carts" DROP CONSTRAINT "carts_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."menu_variants" DROP CONSTRAINT "menu_variants_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_variant_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."menu_variants" ADD CONSTRAINT "menu_variants_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."menu_variants"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
