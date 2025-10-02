-- CreateEnum
CREATE TYPE "public"."StaffInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."StaffInvite" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "franchiseId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "status" "public"."StaffInviteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "acceptedAt" TIMESTAMPTZ(3),

    CONSTRAINT "StaffInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffInvite_token_key" ON "public"."StaffInvite"("token");

-- AddForeignKey
ALTER TABLE "public"."StaffInvite" ADD CONSTRAINT "StaffInvite_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffInvite" ADD CONSTRAINT "StaffInvite_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."StaffRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
