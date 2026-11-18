CREATE TABLE IF NOT EXISTS `smart_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`area` text DEFAULT 'Geral' NOT NULL,
	`severity` text DEFAULT 'aviso' NOT NULL,
	`action_label` text,
	`action_type` text,
	`action_payload` text,
	`is_dismissed` integer DEFAULT 0 NOT NULL,
	`is_demo` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL
);
