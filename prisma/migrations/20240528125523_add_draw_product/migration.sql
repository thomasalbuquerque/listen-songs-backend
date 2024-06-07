-- CreateTable
CREATE TABLE "draw_products_tickets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "draw_products_id" UUID NOT NULL,
    "ticket_number" INTEGER NOT NULL,
    "source" "Source" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draw_products_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draw_products" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_token" DECIMAL(26,18) NOT NULL,
    "price_yupoints" BIGINT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'planned',
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draw_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draw_products_winners" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "draw_products_id" UUID NOT NULL,
    "payment_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draw_products_winners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "draw_products_tickets_ticket_number_draw_products_id_key" ON "draw_products_tickets"("ticket_number", "draw_products_id");

-- CreateIndex
CREATE UNIQUE INDEX "draw_products_winners_draw_products_id_user_id_key" ON "draw_products_winners"("draw_products_id", "user_id");

-- AddForeignKey
ALTER TABLE "draw_products_tickets" ADD CONSTRAINT "draw_products_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draw_products_tickets" ADD CONSTRAINT "draw_products_tickets_draw_products_id_fkey" FOREIGN KEY ("draw_products_id") REFERENCES "draw_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draw_products_winners" ADD CONSTRAINT "draw_products_winners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draw_products_winners" ADD CONSTRAINT "draw_products_winners_draw_products_id_fkey" FOREIGN KEY ("draw_products_id") REFERENCES "draw_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
