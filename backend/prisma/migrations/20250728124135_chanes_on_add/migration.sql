/*
  Warnings:

  - You are about to drop the column `country_id` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `order_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `order_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `user_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `user_addresses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_country_id_fkey";

-- DropForeignKey
ALTER TABLE "order_addresses" DROP CONSTRAINT "order_addresses_country_id_fkey";

-- DropForeignKey
ALTER TABLE "order_addresses" DROP CONSTRAINT "order_addresses_state_id_fkey";

-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_country_id_fkey";

-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_state_id_fkey";

-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_country_id_fkey";

-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_state_id_fkey";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "country_id";

-- AlterTable
ALTER TABLE "order_addresses" DROP COLUMN "country_id",
DROP COLUMN "state_id";

-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "country_id",
DROP COLUMN "state_id";

-- AlterTable
ALTER TABLE "user_addresses" DROP COLUMN "country_id",
DROP COLUMN "state_id";
