CREATE TABLE `admin_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`access_code_hash` text NOT NULL,
	`session_secret` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
