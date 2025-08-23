-- DropForeignKey
ALTER TABLE "public"."carts" DROP CONSTRAINT "carts_variant_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."menu_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
