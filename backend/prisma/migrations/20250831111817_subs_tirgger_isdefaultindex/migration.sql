-- This is an empty migration.
CREATE UNIQUE INDEX "uniq_default_sub_per_user" ON "public"."Sub" ("user_id") WHERE "isDefault" = true;

CREATE OR REPLACE FUNCTION enforce_role_match()
RETURNS TRIGGER AS $$
DECLARE
  plan_role_id INT;
  user_role_id INT;
BEGIN

  SELECT role_id INTO plan_role_id FROM "Plan" WHERE id = NEW.plan_id;

  
  SELECT role_id INTO user_role_id FROM "users" WHERE id = NEW.user_id;

  IF plan_role_id IS NULL THEN
    RAISE EXCEPTION 'Plan % does not exist', NEW.plan_id;
  END IF;

  IF user_role_id IS NULL THEN
    RAISE EXCEPTION 'User % does not exist', NEW.user_id;
  END IF;

  IF plan_role_id <> user_role_id THEN
    RAISE EXCEPTION 'User role (% ) does not match plan role (% )', user_role_id, plan_role_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subs_role_check
BEFORE INSERT OR UPDATE ON "Sub"
FOR EACH ROW
EXECUTE FUNCTION enforce_role_match();
