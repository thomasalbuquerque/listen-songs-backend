-- CreateEnum
CREATE TYPE "Status" AS ENUM ('planned', 'active', 'paused', 'finished', 'canceled');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('earned', 'app');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('forgotPassword', 'emailConfirmation');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "inviter_code" TEXT NOT NULL,
    "invited_by_id" UUID,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_image" TEXT,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mobiles" (
    "id" UUID NOT NULL,
    "settings_id" UUID NOT NULL,
    "device_id" TEXT NOT NULL,
    "firebase_token" TEXT,
    "deviceOS" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mobiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_data" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "id_card" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "personal_data_id" UUID NOT NULL,
    "zip_code" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms" (
    "id" UUID NOT NULL,
    "personal_data_id" UUID NOT NULL,
    "code" INTEGER NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "attempts" SMALLINT NOT NULL DEFAULT 0,
    "campaign_id" TEXT,
    "message_id" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_data" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "wallet" TEXT,
    "token" DECIMAL(26,18) NOT NULL DEFAULT 0,
    "yupoints" BIGINT NOT NULL DEFAULT 0,
    "version" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdraws" (
    "id" UUID NOT NULL,
    "payment_data_id" UUID NOT NULL,
    "to_wallet" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "gross_value" DECIMAL(26,18) NOT NULL,
    "tax" DECIMAL(26,18) NOT NULL,
    "net_value" DECIMAL(26,18) NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "withdraws_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spotify_data" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_in" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spotify_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "heard_songs" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "user_reward_token" DECIMAL(26,18) NOT NULL,
    "user_reward_yupoints" SMALLINT NOT NULL,
    "inviter_id" UUID,
    "inviter_reward_token" DECIMAL(26,18),
    "inviter_reward_yupoints" SMALLINT,
    "songId" UUID NOT NULL,
    "playlist_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heard_songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" UUID NOT NULL,
    "song_id_spotify" TEXT NOT NULL,
    "artist_id_spotify" TEXT NOT NULL,
    "seconds" SMALLINT NOT NULL,
    "give_token" BOOLEAN NOT NULL,
    "give_yupoints" BOOLEAN NOT NULL,
    "token_brl" REAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlists" (
    "id" UUID NOT NULL,
    "playlist_id_spotify" TEXT NOT NULL,
    "playlist_name" TEXT NOT NULL,
    "playlist_owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allowed_songs" (
    "id" UUID NOT NULL,
    "song_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "allowed_songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "songs_chunk" SMALLINT NOT NULL,
    "ticket_price_brl" REAL NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'planned',
    "awards" TEXT[],
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns_tickets" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "ticket_number" INTEGER NOT NULL,
    "source" "Source" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns_winners" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "winner_position" INTEGER NOT NULL,
    "payment_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_winners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_codes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email_sent" BOOLEAN NOT NULL DEFAULT false,
    "category" "Category" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_reports" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sum_user_reward_token" DECIMAL(26,18) NOT NULL,
    "sum_user_reward_yupoints" BIGINT NOT NULL,
    "sum_invited_reward_token" DECIMAL(26,18) NOT NULL,
    "sum_invited_reward_yupoints" BIGINT NOT NULL,
    "heard_songs_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_monthly_reports" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "month" SMALLINT NOT NULL,
    "year" SMALLINT NOT NULL,
    "sum_user_reward_token" DECIMAL(26,18) NOT NULL,
    "sum_user_reward_yupoints" BIGINT NOT NULL,
    "sum_invited_reward_token" DECIMAL(26,18) NOT NULL,
    "sum_invited_reward_yupoints" BIGINT NOT NULL,
    "heard_songs_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_monthly_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song_daily_reports" (
    "id" TEXT NOT NULL,
    "song_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "playlists" JSONB NOT NULL,
    "sum_users_token" DECIMAL(26,18) NOT NULL,
    "sum_users_yupoints" BIGINT NOT NULL,
    "sum_inviters_token" DECIMAL(26,18) NOT NULL,
    "sum_inviters_yupoints" BIGINT NOT NULL,
    "heard_songs_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "song_daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" UUID NOT NULL,
    "follower_id" UUID NOT NULL,
    "following_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "image_url" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stake_phrases" (
    "old_user_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "token_in_stake" TEXT NOT NULL,
    "token_in_wallet" TEXT NOT NULL,
    "public_address" TEXT NOT NULL,
    "private_address" TEXT NOT NULL,
    "last_get_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_inviter_code_key" ON "users"("inviter_code");

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_id_key" ON "settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mobiles_device_id_key" ON "mobiles"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_data_user_id_key" ON "personal_data"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_data_id_card_key" ON "personal_data"("id_card");

-- CreateIndex
CREATE UNIQUE INDEX "personal_data_phone_key" ON "personal_data"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_personal_data_id_key" ON "addresses"("personal_data_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_data_user_id_key" ON "payment_data"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "withdraws_hash_key" ON "withdraws"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "spotify_data_user_id_key" ON "spotify_data"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "spotify_data_spotify_id_key" ON "spotify_data"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "songs_song_id_spotify_key" ON "songs"("song_id_spotify");

-- CreateIndex
CREATE UNIQUE INDEX "playlists_playlist_id_spotify_key" ON "playlists"("playlist_id_spotify");

-- CreateIndex
CREATE UNIQUE INDEX "allowed_songs_song_id_campaign_id_key" ON "allowed_songs"("song_id", "campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_tickets_ticket_number_campaign_id_key" ON "campaigns_tickets"("ticket_number", "campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_winners_campaign_id_user_id_key" ON "campaigns_winners"("campaign_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "follows_follower_id_following_id_key" ON "follows"("follower_id", "following_id");

-- CreateIndex
CREATE UNIQUE INDEX "stake_phrases_old_user_id_key" ON "stake_phrases"("old_user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobiles" ADD CONSTRAINT "mobiles_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_data" ADD CONSTRAINT "personal_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_personal_data_id_fkey" FOREIGN KEY ("personal_data_id") REFERENCES "personal_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms" ADD CONSTRAINT "sms_personal_data_id_fkey" FOREIGN KEY ("personal_data_id") REFERENCES "personal_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_data" ADD CONSTRAINT "payment_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraws" ADD CONSTRAINT "withdraws_payment_data_id_fkey" FOREIGN KEY ("payment_data_id") REFERENCES "payment_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spotify_data" ADD CONSTRAINT "spotify_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heard_songs" ADD CONSTRAINT "heard_songs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heard_songs" ADD CONSTRAINT "heard_songs_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heard_songs" ADD CONSTRAINT "heard_songs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heard_songs" ADD CONSTRAINT "heard_songs_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allowed_songs" ADD CONSTRAINT "allowed_songs_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allowed_songs" ADD CONSTRAINT "allowed_songs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns_tickets" ADD CONSTRAINT "campaigns_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns_tickets" ADD CONSTRAINT "campaigns_tickets_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns_winners" ADD CONSTRAINT "campaigns_winners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns_winners" ADD CONSTRAINT "campaigns_winners_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_codes" ADD CONSTRAINT "email_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_reports" ADD CONSTRAINT "user_daily_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_monthly_reports" ADD CONSTRAINT "user_monthly_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_daily_reports" ADD CONSTRAINT "song_daily_reports_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
