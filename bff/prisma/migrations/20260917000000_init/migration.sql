-- CreateTable
CREATE TABLE "app_snapshots" (
    "app_id" VARCHAR(64) NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "errors" JSONB NOT NULL DEFAULT '{}',
    "fetched_at" TIMESTAMPTZ(3),
    "refresh_started_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "app_snapshots_pkey" PRIMARY KEY ("app_id")
);

-- CreateTable
CREATE TABLE "health_checks" (
    "id" SERIAL NOT NULL,
    "app_id" VARCHAR(64) NOT NULL,
    "status" VARCHAR(8) NOT NULL,
    "reachable" BOOLEAN NOT NULL,
    "latency_ms" INTEGER,
    "checked_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "health_checks_app_id_checked_at_idx" ON "health_checks"("app_id", "checked_at");

-- AddForeignKey
ALTER TABLE "health_checks" ADD CONSTRAINT "health_checks_app_id_fkey"
    FOREIGN KEY ("app_id") REFERENCES "app_snapshots"("app_id") ON DELETE CASCADE ON UPDATE CASCADE;
