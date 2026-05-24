CREATE TABLE `notification_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`scheduled_enabled` integer DEFAULT 0 NOT NULL,
	`schedule_hours` text DEFAULT '[0,12]' NOT NULL,
	`last_notification_at` text,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `contact_messages` ADD `notified` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `contact_messages` SET `notified` = 1;--> statement-breakpoint
CREATE INDEX `idx_contact_messages_notified` ON `contact_messages` (`notified`);