


-- searches: {
--  id: <serial8>, //paper id
--	date_created: <timestamp>, //creation date of paper
--	date_last_modified: <timestamp>,  // last modified date of paper
--	date_deleted: <timestamp>,  // date of elimination of paper
--	data: <jsonb>,        // json field that stores the paper data
-- }


CREATE TABLE "public"."searches" (
"id" serial8 NOT NULL,
"date_created" timestamptz NOT NULL,
"date_last_modified" timestamptz NOT NULL,
"date_deleted" timestamptz,
"data" jsonb NOT NULL,
PRIMARY KEY ("id")
)
WITH (OIDS=FALSE)
;

-- projects: {
--  id: <serial8>, //project id
--	date_created: <timestamp>, //creation date of paper
--	date_last_modified: <timestamp>,  // last modified date of paper
--	date_deleted: <timestamp>,  // date of elimination of paper
--	data: <jsonb>,        // json field that stores the project name and description
-- }


CREATE TABLE "public"."projects" (
"id" serial8 NOT NULL,
"date_created" timestamptz NOT NULL,
"date_last_modified" timestamptz NOT NULL,
"date_deleted" timestamptz,
"data" jsonb NOT NULL,
PRIMARY KEY ("id")
)
WITH (OIDS=FALSE)
;

-- project_papers: {
--  id: <serial8>, //paper id
--	date_created: <timestamp>, //creation date of paper
--	date_last_modified: <timestamp>,  // last modified date of paper
--	date_deleted: <timestamp>,  // date of elimination of paper
--	data: <jsonb>,        // json field that stores the paper data
-- project_id: <integer>, //project associated, foreign key with casacade option
-- }




CREATE TABLE "public"."project_papers" (
"id" serial8 NOT NULL,
"date_created" timestamptz NOT NULL,
"date_last_modified" timestamptz NOT NULL,
"date_deleted" timestamptz,
"data" jsonb NOT NULL,
"project_id" int8 NOT NULL,
PRIMARY KEY ("id"),
CONSTRAINT "project_id" FOREIGN KEY ("project_id") REFERENCES "public"."projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)
WITH (OIDS=FALSE)
;

-- users: {
--  id: <serial8>, //users id
--	date_created: <timestamp>, //creation date of users
--	date_last_modified: <timestamp>,  // last modified date of users
--	date_deleted: <timestamp>,  // date of elimination of users
--	data: <jsonb>,        // json field that stores the user data
-- }


CREATE TABLE "public"."users" (
"id" serial8 NOT NULL,
"date_created" timestamptz NOT NULL,
"date_last_modified" timestamptz NOT NULL,
"date_deleted" timestamptz,
"data" jsonb NOT NULL,
PRIMARY KEY ("id")
)
WITH (OIDS=FALSE)
;

-- filters: {
--  id: <serial8>, //users id
--	date_created: <timestamp>, //creation date of users
--	date_last_modified: <timestamp>,  // last modified date of users
--	date_deleted: <timestamp>,  // date of elimination of users
--	data: <jsonb>,        // json field that stores the filters data
-- }
-- }

CREATE TABLE "public"."filters" (
"id" serial8 NOT NULL,
"date_created" timestamptz NOT NULL,
"date_last_modified" timestamptz NOT NULL,
"date_deleted" timestamptz,
"data" jsonb NOT NULL,
"project_id" int8 NOT NULL,
PRIMARY KEY ("id"),
CONSTRAINT "project_id" FOREIGN KEY ("project_id") REFERENCES "public"."projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)
WITH (OIDS=FALSE)
;

-- votes: {
--  id: <serial8>, //users id
--	date_created: <timestamp>, //creation date of users
--	date_last_modified: <timestamp>,  // last modified date of users
--	date_deleted: <timestamp>,  // date of elimination of users
--	data: <jsonb>,        // json field that stores the screening_vote data
-- }
-- }


CREATE TABLE "public"."votes" (
"id" serial8 NOT NULL,
"date_created" timestamptz NOT NULL,
"date_last_modified" timestamptz NOT NULL,
"date_deleted" timestamptz,
"data" jsonb NOT NULL,
"user_id" int8 NOT NULL,
"project_paper_id" int8 NOT NULL,
"project_id" int8 NOT NULL,
PRIMARY KEY ("id"),
CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT "project_paper_id" FOREIGN KEY ("project_paper_id") REFERENCES "public"."project_papers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT "project_id" FOREIGN KEY ("project_id") REFERENCES "public"."projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)
WITH (OIDS=FALSE)
;


CREATE TABLE "public"."screenings" (
"id" serial8 NOT NULL,
"date_created" timestamptz NOT NULL,
"date_last_modified" timestamptz NOT NULL,
"date_deleted" timestamptz,
"data" jsonb NOT NULL,
"user_id" int8 NOT NULL,
"project_id" int8 NOT NULL,
PRIMARY KEY ("id"),
CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT "project_id" FOREIGN KEY ("project_id") REFERENCES "public"."projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)
WITH (OIDS=FALSE)
;

