SELECT * FROM current_catalog
;

CREATE SCHEMA crm
;

CREATE TABLE crm.token (
	id serial NOT NULL,
	user_id INT NOT NULL,
	refreshToken VARCHAR(100) DEFAULT NULL,
	CONSTRAINT token_pkey PRIMARY KEY (id),
	CONSTRAINT fk_users
  		FOREIGN KEY(user_id)
	  		REFERENCES crm.users(id)
	  		ON DELETE CASCADE
);

-- DROP TABLE crm.clients
-- 1
CREATE TABLE crm.clients (
	id serial NOT NULL,
	"name" VARCHAR(30) NOT NULL,
	phone VARCHAR(30) NOT NULL,
	email VARCHAR(100) DEFAULT NULL,
	CONSTRAINT clients_phone_key UNIQUE (phone),
	CONSTRAINT clients_pkey PRIMARY KEY (id)
);

-- DROP TABLE crm.schedulepatient;
-- 2
CREATE TABLE crm.schedulepatient (
	id SERIAL NOT NULL,
	client_id INT NOT NULL,
	__date__ TIMESTAMP WITH TIME ZONE NOT null,
	CONSTRAINT schdulepatient_pkey PRIMARY KEY (id),
   	CONSTRAINT fk_clients
  		FOREIGN KEY(client_id)
	  		REFERENCES crm.clients(id)
	  		ON DELETE CASCADE
);

-- DROP TYPE status;
-- 3
CREATE TYPE status AS ENUM ('wait', 'init', 'not_init')
;

-- DROP TABLE crm.records;
-- 4
CREATE TABLE crm.records (
	id SERIAL NOT NULL,
	client_id INT NOT NULL,
	__date__ TIMESTAMP WITH TIME ZONE NOT NULL,
	CONSTRAINT records_pkey PRIMARY KEY (id),
   	CONSTRAINT fk_clients
  		FOREIGN KEY(client_id)
	  		REFERENCES crm.clients(id)
	  		ON DELETE CASCADE
);

-- DROP TABLE crm.breeds;
-- 5
CREATE TABLE crm.breeds (
	id SERIAL NOT NULL,
	animals_category_id INT,
	"name" VARCHAR(50) NOT NULL,
	CONSTRAINT breeds_pkey PRIMARY KEY (id),
	CONSTRAINT breeds_name_key UNIQUE (name)
);

-- DROP TABLE crm.animals_category;
-- 6
CREATE TABLE crm.animals_category (
	id SERIAL NOT NULL,
	parent_id INT DEFAULT NULL,
	"name" VARCHAR(50) NOT NULL,
	CONSTRAINT animals_category_pkey PRIMARY KEY (id),
	CONSTRAINT animals_category_name_key UNIQUE (name)
);

-- DROP TABLE crm.roles
-- 7
CREATE TABLE crm.roles (
	id SERIAL NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id),
	CONSTRAINT roles_name_key UNIQUE (name)
);

-- DROP TABLE crm.users;
-- 8
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

-- DROP TABLE crm.services;
-- 9
CREATE TABLE crm.services (
	id SERIAL NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	__sum__ NUMERIC(12,2) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
	CONSTRAINT services_pkey PRIMARY KEY (id),
	CONSTRAINT services_name_key UNIQUE (name)
);

-- SELECT ZONE **************************************

SELECT * FROM crm.clients
;

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

SELECT * FROM crm.services
;

SELECT '12.34'::float8::numeric::money;

SELECT '52093.89'::money::numeric::float8;
