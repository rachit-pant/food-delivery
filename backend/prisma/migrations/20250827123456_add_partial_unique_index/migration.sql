


CREATE UNIQUE INDEX "user_addresses_user_id_address_key" ON "public"."user_addresses"("user_id") WHERE "is_default" = true;