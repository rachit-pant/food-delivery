-- CreateEnum
CREATE TYPE "public"."FranchiseStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."StaffStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "public"."restaurants" ADD COLUMN     "franchiseId" INTEGER,
ADD COLUMN     "restaurant_categories_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."Franchise" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "status" "public"."FranchiseStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Franchise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staff" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT,
    "staffRoleId" INTEGER NOT NULL,
    "status" "public"."StaffStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffRole" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FranchiseStaff" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "franchiseId" INTEGER NOT NULL,
    "position" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMPTZ(3),

    CONSTRAINT "FranchiseStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."restaurant_categories" (
    "id" SERIAL NOT NULL,
    "cat_name" VARCHAR NOT NULL,

    CONSTRAINT "restaurant_categories_pkey" PRIMARY KEY ("id")
);
INSERT INTO "public"."restaurant_categories" (id, cat_name) VALUES (1, 'Default') 
ON CONFLICT DO NOTHING;
-- AddForeignKey
ALTER TABLE "public"."restaurants" ADD CONSTRAINT "restaurants_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurants" ADD CONSTRAINT "restaurants_restaurant_categories_id_fkey" FOREIGN KEY ("restaurant_categories_id") REFERENCES "public"."restaurant_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Franchise" ADD CONSTRAINT "Franchise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff" ADD CONSTRAINT "staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff" ADD CONSTRAINT "staff_staffRoleId_fkey" FOREIGN KEY ("staffRoleId") REFERENCES "public"."StaffRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FranchiseStaff" ADD CONSTRAINT "FranchiseStaff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FranchiseStaff" ADD CONSTRAINT "FranchiseStaff_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
