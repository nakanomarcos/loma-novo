CREATE TABLE IF NOT EXISTS `finance_protections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'vida' NOT NULL,
	`insurer` text NOT NULL,
	`coverage_amount_cents` integer DEFAULT 0 NOT NULL,
	`premium_monthly_cents` integer DEFAULT 0 NOT NULL,
	`policy_number` text DEFAULT '' NOT NULL,
	`renews_at` text DEFAULT '' NOT NULL,
	`beneficiaries` text DEFAULT '' NOT NULL,
	`notes` text,
	`is_demo` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL
);
