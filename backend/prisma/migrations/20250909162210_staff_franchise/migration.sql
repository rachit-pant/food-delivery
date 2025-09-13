-- This is an empty migration.
CREATE UNIQUE INDEX ux_active_franchise_staff
ON "FranchiseStaff"("staffId", "franchiseId")
WHERE "isActive" = true;