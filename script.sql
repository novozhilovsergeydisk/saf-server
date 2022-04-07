DROP TABLE transplant.schedulepatient;

CREATE TABLE transplant.schedulepatient (
	id SERIAL NOT NULL,
	client_id INT NOT NULL,
	date TIMESTAMP WITH TIME ZONE NOT null,
	CONSTRAINT schdulepatient_pkey PRIMARY KEY (id),
   	CONSTRAINT fk_clients
  		FOREIGN KEY(client_id)
	  		REFERENCES transplant.clients(id)
	  		ON DELETE CASCADE
);

SELECT * FROM current_catalog
;

DROP TYPE status;

CREATE TYPE status AS ENUM ('wait', 'init', 'not_init');

SELECT
	*
    --schemaname, tablename, tableowner, hasindexes
FROM pg_tables
--WHERE tableowner != null
--AND schemaname != null
ORDER BY tablename
;

-- create schema transplant;

DROP TABLE transplant.records;

CREATE TABLE transplant.records (
	id SERIAL NOT NULL,
	client_id INT NOT NULL,
	date TIMESTAMP WITH TIME ZONE NOT null,
	CONSTRAINT records_pkey PRIMARY KEY (id),
   	CONSTRAINT fk_clients
  		FOREIGN KEY(client_id)
	  		REFERENCES transplant.clients(id)
	  		ON DELETE CASCADE
);

CREATE TABLE transplant.roles (
	id SERIAL NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id),
	CONSTRAINT roles_name_key UNIQUE (name)
);

SELECT * FROM transplant.clients
;

DROP TABLE transplant.users;

CREATE TABLE transplant.users (
	id serial NOT NULL,
	"name" varchar(30) NOT NULL,
	phone varchar(30)  DEFAULT NULL,
	email varchar(50) NOT NULL,
	token varchar(50) NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_token_key UNIQUE (token),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

DROP TABLE transplant.clients;

SELECT '12.34'::float8::numeric::money;

SELECT '52093.89'::money::numeric::float8;

CREATE TABLE transplant.clients (
	id serial NOT NULL,
	"name" varchar(30) NOT NULL,
	phone varchar(30) NOT NULL,
	email varchar(100) DEFAULT NULL,
	CONSTRAINT clients_phone_key UNIQUE (phone),
	CONSTRAINT clients_pkey PRIMARY KEY (id)
);

DROP TABLE transplant.services;

CREATE TABLE transplant.services (
	id SERIAL NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	summ NUMERIC(12,2) NOT NULL,
	CONSTRAINT services_pkey PRIMARY KEY (id),
	CONSTRAINT services_name_key UNIQUE (name)
);

SELECT * FROM transplant.services;