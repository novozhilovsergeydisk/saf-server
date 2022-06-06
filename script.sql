-- crm

SELECT * FROM current_catalog
;

DROP table IF EXISTS crm.records;
DROP TABLE IF EXISTS crm.scheduleclients;
DROP TABLE IF EXISTS crm.clients;
DROP TABLE IF EXISTS crm.breeds;
DROP TABLE IF EXISTS crm.animals_category;
DROP TABLE IF EXISTS crm.services;
DROP TABLE IF EXISTS crm.roles;
DROP TABLE IF EXISTS crm.users;
DROP TYPE IF EXISTS status;
DROP SCHEMA IF EXISTS crm;

CREATE SCHEMA if NOT EXISTS crm
;

-- 1 CREATE TABLE crm.clients
CREATE TABLE crm.clients (
	id serial NOT NULL,
	"name" VARCHAR(30) NOT NULL,
	phone VARCHAR(30) NOT NULL,
	email VARCHAR(100) DEFAULT NULL,
	CONSTRAINT clients_phone_key UNIQUE (phone),
	CONSTRAINT clients_pkey PRIMARY KEY (id)
);

-- 2 CREATE TABLE crm.scheduleclients
CREATE TABLE crm.scheduleclients (
	id SERIAL NOT NULL,
	client_id INT NOT NULL,
	__date__ TIMESTAMP WITH TIME ZONE NOT null,
	CONSTRAINT schdulepatient_pkey PRIMARY KEY (id),
   	CONSTRAINT fk_clients
  		FOREIGN KEY(client_id)
	  		REFERENCES crm.clients(id)
	  		ON DELETE CASCADE
);

-- 3 CREATE TYPE status
CREATE TYPE status AS ENUM ('wait', 'init', 'not_init')
;

-- 4 CREATE TABLE crm.records
CREATE TABLE crm.records (
	id SERIAL NOT NULL,
	client_id INT NOT NULL,
	__date__ TIMESTAMP WITH TIME ZONE NOT NULL,
--	__sum__ NUMERIC(12,2) NOT NULL,
	CONSTRAINT records_pkey PRIMARY KEY (id),
   	CONSTRAINT fk_clients
  		FOREIGN KEY(client_id)
	  		REFERENCES crm.clients(id)
	  		ON DELETE CASCADE
);

-- 5 CREATE TABLE crm.breeds
CREATE TABLE crm.breeds (
	id SERIAL NOT NULL,
	animals_category_id INT,
	"name" VARCHAR(50) NOT NULL,
	CONSTRAINT breeds_pkey PRIMARY KEY (id),
	CONSTRAINT breeds_name_key UNIQUE (name)
);

-- 6 CREATE TABLE crm.animals_category
CREATE TABLE crm.animals_category (
	id SERIAL NOT NULL,
	parent_id INT DEFAULT NULL,
	"name" VARCHAR(50) NOT NULL,
	CONSTRAINT animals_category_pkey PRIMARY KEY (id),
	CONSTRAINT animals_category_name_key UNIQUE (name)
);

-- 7 CREATE TABLE crm.roles
CREATE TABLE crm.roles (
	id SERIAL NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id),
	CONSTRAINT roles_name_key UNIQUE (name)
);

-- 8 CREATE TABLE crm.users
CREATE TABLE crm.users (
	id serial NOT NULL,
	"name" VARCHAR(30) NOT NULL,
	phone VARCHAR(30) DEFAULT NULL,
	email VARCHAR(50) NOT NULL,
	token VARCHAR(50) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_token_key UNIQUE (token),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- 9 CREATE TABLE crm.services
CREATE TABLE crm.services (
	id SERIAL NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
	CONSTRAINT services_pkey PRIMARY KEY (id),
	CONSTRAINT services_name_key UNIQUE (name)
);

-- 10 CREATE TABLE crm.recordspay
CREATE TABLE crm.recordspay (
	id SERIAL NOT NULL,
	record_id INT NOT NULL,
	__date__ TIMESTAMP WITH TIME ZONE NOT NULL,
--	__sum__ NUMERIC(12,2) NOT NULL,
	CONSTRAINT recordspay_pkey PRIMARY KEY (id),
   	CONSTRAINT fk_records
  		FOREIGN KEY(record_id)
	  		REFERENCES crm.records(id)
	  		ON DELETE CASCADE
);

-- END CREATE


--INSERT INTO crm.clients VALUES(nextval('crm.clients_id_seq'), 'Brent Connell', '1-393-233-2850', 'Kiara94@gmail.com')

-- TRUNCATE FROM crm.clients


SELECT
	*
	-- schemaname, tablename, tableowner, hasindexes
FROM
    pg_tables
--WHERE 1=1
--AND tableowner != null
--AND schemaname != null
ORDER BY
    tablename
;

SELECT * FROM crm.clients
ORDER BY id desc
;

SELECT * FROM crm.records;
SELECT * FROM crm.scheduleclients;
SELECT * FROM crm.clients;
SELECT * FROM crm.breeds;
SELECT * FROM crm.animals_category;
SELECT * FROM crm.services;
SELECT * FROM crm.roles;
SELECT * FROM crm.users;

SELECT '12.34'::float8::numeric::money
;


SELECT '52093.89'::money::numeric::float8
;

