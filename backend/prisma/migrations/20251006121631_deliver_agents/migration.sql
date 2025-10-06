-- AlterTable
ALTER TABLE "public"."restaurants" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."user_addresses" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "restaurants_lat_lng_idx" ON "public"."restaurants"("lat", "lng");

-- CreateIndex
CREATE INDEX "user_addresses_lat_lng_idx" ON "public"."user_addresses"("lat", "lng");
