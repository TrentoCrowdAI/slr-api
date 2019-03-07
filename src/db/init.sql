
-- papers: {
--  id: <integer>, 
--	date_created: <timestamp>, //creation date of paper
--	date_last_modified: <timestamp>,  // last modified date of paper
--	date_deleted: <timestamp>,  // date of elimination of paper
--	content: <string>,        // json field what stores all paper
-- }

DROP TABLE IF EXISTS "public"."papers";
CREATE TABLE "public"."papers" (
"id" serial8 NOT NULL,
"date_created" timestamptz NOT NULL,
"date_last_modified" timestamptz NOT NULL,
"date_deleted" timestamptz,
"content" text NOT NULL,
PRIMARY KEY ("id")
)
WITH (OIDS=FALSE)
;