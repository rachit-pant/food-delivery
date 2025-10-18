-- DropForeignKey
ALTER TABLE "public"."FranchiseStaff" DROP CONSTRAINT "FranchiseStaff_franchiseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StaffInvite" DROP CONSTRAINT "StaffInvite_franchiseId_fkey";

-- AddForeignKey
ALTER TABLE "public"."FranchiseStaff" ADD CONSTRAINT "FranchiseStaff_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."StaffInvite" ADD CONSTRAINT "StaffInvite_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
