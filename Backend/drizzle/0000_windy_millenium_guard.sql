CREATE TYPE "public"."allowed_claimant_type" AS ENUM('human', 'agent', 'both');--> statement-breakpoint
CREATE TYPE "public"."auth_type" AS ENUM('wallet_human', 'wallet_agent');--> statement-breakpoint
CREATE TYPE "public"."funding_status" AS ENUM('pending', 'confirmed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'confirmed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payout_triggered_by" AS ENUM('client', 'system', 'agent');--> statement-breakpoint
CREATE TYPE "public"."review_decision" AS ENUM('approve', 'reject');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('DRAFT', 'FUNDED', 'OPEN', 'CLAIMED', 'SUBMITTED', 'PENDING_REVIEW', 'APPROVED', 'AUTO_APPROVED', 'REJECTED', 'PAID');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('client', 'worker', 'agent', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verification_recommendation" AS ENUM('approve', 'manual_review', 'reject');--> statement-breakpoint
CREATE TABLE "agent_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"label" text NOT NULL,
	"token_hash" text NOT NULL,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"role" "user_role" NOT NULL,
	"stellar_wallet_address" text NOT NULL,
	"auth_type" "auth_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_not_blank" CHECK (length(trim("users"."username")) > 0),
	CONSTRAINT "users_wallet_address_format" CHECK ("users"."stellar_wallet_address" ~ '^[G][A-Z2-7]{55}$'),
	CONSTRAINT "users_auth_type_role_match" CHECK ((("users"."auth_type" = 'wallet_agent') AND ("users"."role" = 'agent'))
          OR (("users"."auth_type" = 'wallet_human') AND ("users"."role" <> 'agent'))),
	CONSTRAINT "users_agent_username_suffix_check" CHECK (("users"."role" <> 'agent') OR ("users"."username" LIKE '%.agents'))
);
--> statement-breakpoint
CREATE TABLE "task_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"actor_user_id" uuid,
	"event_type" text NOT NULL,
	"event_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_fundings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"funder_user_id" uuid,
	"from_wallet_address" text NOT NULL,
	"to_wallet_address" text NOT NULL,
	"amount" numeric(18, 7) NOT NULL,
	"asset_code" text NOT NULL,
	"tx_hash" text NOT NULL,
	"status" "funding_status" NOT NULL,
	"funded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "task_fundings_from_wallet_address_format" CHECK ("task_fundings"."from_wallet_address" ~ '^[G][A-Z2-7]{55}$'),
	CONSTRAINT "task_fundings_to_wallet_address_format" CHECK ("task_fundings"."to_wallet_address" ~ '^[G][A-Z2-7]{55}$'),
	CONSTRAINT "task_fundings_tx_hash_format" CHECK ("task_fundings"."tx_hash" ~ '^[A-Fa-f0-9]{64}$'),
	CONSTRAINT "task_fundings_amount_positive" CHECK ("task_fundings"."amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"worker_id" uuid,
	"active_submission_id" uuid,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"brief" varchar(100) NOT NULL,
	"required_keywords" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"target_audience" text NOT NULL,
	"tone" text NOT NULL,
	"min_word_count" integer NOT NULL,
	"payout_amount" numeric(18, 7) NOT NULL,
	"currency_asset" text NOT NULL,
	"status" "task_status" DEFAULT 'DRAFT' NOT NULL,
	"review_window_hours" integer NOT NULL,
	"review_deadline" timestamp with time zone,
	"allowed_claimant_type" "allowed_claimant_type" DEFAULT 'both' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tasks_title_not_blank" CHECK (length(trim("tasks"."title")) > 0),
	CONSTRAINT "tasks_description_not_blank" CHECK (length(trim("tasks"."description")) > 0),
	CONSTRAINT "tasks_brief_not_blank" CHECK (length(trim("tasks"."brief")) > 0),
	CONSTRAINT "tasks_min_word_count_non_negative" CHECK ("tasks"."min_word_count" >= 0),
	CONSTRAINT "tasks_payout_amount_positive" CHECK ("tasks"."payout_amount" > 0),
	CONSTRAINT "tasks_review_window_hours_positive" CHECK ("tasks"."review_window_hours" > 0)
);
--> statement-breakpoint
CREATE TABLE "review_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"reviewer_user_id" uuid NOT NULL,
	"decision" "review_decision" NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "review_decisions_reject_reason_required" CHECK (("review_decisions"."decision" <> 'reject') OR length(trim(coalesce("review_decisions"."reason", ''))) > 0)
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"worker_id" uuid NOT NULL,
	"content_text" text NOT NULL,
	"notes" text,
	"document_url" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"submission_id" uuid NOT NULL,
	"summary" text NOT NULL,
	"score" integer NOT NULL,
	"keyword_coverage" jsonb NOT NULL,
	"missing_requirements" jsonb NOT NULL,
	"tone_match" boolean NOT NULL,
	"audience_fit" boolean NOT NULL,
	"recommendation" "verification_recommendation" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "verification_reports_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"amount" numeric(18, 7) NOT NULL,
	"asset_code" text NOT NULL,
	"worker_wallet_address" text NOT NULL,
	"tx_hash" text,
	"status" "payout_status" DEFAULT 'pending' NOT NULL,
	"triggered_by" "payout_triggered_by" NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payouts_worker_wallet_address_format" CHECK ("payouts"."worker_wallet_address" ~ '^[G][A-Z2-7]{55}$'),
	CONSTRAINT "payouts_tx_hash_format" CHECK ("payouts"."tx_hash" IS NULL OR "payouts"."tx_hash" ~ '^[A-Fa-f0-9]{64}$'),
	CONSTRAINT "payouts_amount_positive" CHECK ("payouts"."amount" > 0)
);
--> statement-breakpoint
ALTER TABLE "agent_credentials" ADD CONSTRAINT "agent_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_events" ADD CONSTRAINT "task_events_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_events" ADD CONSTRAINT "task_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_fundings" ADD CONSTRAINT "task_fundings_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_fundings" ADD CONSTRAINT "task_fundings_funder_user_id_users_id_fk" FOREIGN KEY ("funder_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_decisions" ADD CONSTRAINT "review_decisions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_decisions" ADD CONSTRAINT "review_decisions_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_reports" ADD CONSTRAINT "verification_reports_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_reports" ADD CONSTRAINT "verification_reports_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "agent_credentials_token_hash_unique" ON "agent_credentials" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_wallet_address_unique" ON "users" USING btree ("stellar_wallet_address");--> statement-breakpoint
CREATE INDEX "task_events_task_id_idx" ON "task_events" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_events_event_type_idx" ON "task_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "task_fundings_task_id_idx" ON "task_fundings" USING btree ("task_id");--> statement-breakpoint
CREATE UNIQUE INDEX "task_fundings_tx_hash_unique" ON "task_fundings" USING btree ("tx_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "task_fundings_one_confirmed_per_task" ON "task_fundings" USING btree ("task_id") WHERE "task_fundings"."status" = 'confirmed';--> statement-breakpoint
CREATE INDEX "tasks_client_id_idx" ON "tasks" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "tasks_worker_id_idx" ON "tasks" USING btree ("worker_id");--> statement-breakpoint
CREATE INDEX "tasks_active_submission_id_idx" ON "tasks" USING btree ("active_submission_id");--> statement-breakpoint
CREATE INDEX "tasks_status_idx" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "review_decisions_task_id_idx" ON "review_decisions" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "submissions_task_id_idx" ON "submissions" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "submissions_worker_id_idx" ON "submissions" USING btree ("worker_id");--> statement-breakpoint
CREATE INDEX "submissions_submitted_at_idx" ON "submissions" USING btree ("submitted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "submissions_id_task_id_unique" ON "submissions" USING btree ("id","task_id");--> statement-breakpoint
CREATE INDEX "verification_reports_task_id_idx" ON "verification_reports" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "payouts_task_id_idx" ON "payouts" USING btree ("task_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payouts_task_id_unique" ON "payouts" USING btree ("task_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payouts_tx_hash_unique" ON "payouts" USING btree ("tx_hash") WHERE "payouts"."tx_hash" IS NOT NULL;
