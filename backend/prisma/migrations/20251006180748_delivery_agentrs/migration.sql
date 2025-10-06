-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "delivery_agent_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."delivery_agents" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "currentLat" DOUBLE PRECISION,
    "currentLng" DOUBLE PRECISION,
    "status" "public"."StaffStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "delivery_agents_user_id_key" ON "public"."delivery_agents"("user_id");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_delivery_agent_id_fkey" FOREIGN KEY ("delivery_agent_id") REFERENCES "public"."delivery_agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."delivery_agents" ADD CONSTRAINT "delivery_agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
