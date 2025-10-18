-- DropForeignKey
ALTER TABLE "public"."StaffInvite" DROP CONSTRAINT "StaffInvite_franchiseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."carts" DROP CONSTRAINT "carts_restaurant_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."StaffInvite" ADD CONSTRAINT "StaffInvite_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
