CREATE TABLE `leads` (
  `lead_id` Utf8 NOT NULL,
  `created_at` Utf8 NOT NULL,
  `stage` Utf8 NOT NULL,
  `route` Utf8 NOT NULL,
  `name` Utf8 NOT NULL,
  `contact` Utf8 NOT NULL,
  `contact_hash` Utf8 NOT NULL,
  `project_url` Utf8,
  `comment` Utf8,
  `consent` Bool NOT NULL,
  `consent_version` Utf8 NOT NULL,
  `authorized_for_active_checks` Bool NOT NULL,
  `answers_json` Json NOT NULL,
  `summary_json` Json,
  `status` Utf8 NOT NULL,
  PRIMARY KEY (`lead_id`)
);

CREATE INDEX `idx_leads_created_at` GLOBAL ON `leads` (`created_at`);
CREATE INDEX `idx_leads_contact_hash` GLOBAL ON `leads` (`contact_hash`);