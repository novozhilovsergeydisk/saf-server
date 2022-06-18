--CREATE USER cs_admin WITH PASSWORD 'cs_admin@12345';

DO
$do$
BEGIN
    IF EXISTS (SELECT * FROM pg_catalog.pg_roles WHERE  rolname = 'cs_admin') THEN
        RAISE NOTICE 'Role "cs_admin" already exists.';
    ELSE
        CREATE ROLE cs_admin LOGIN PASSWORD 'cs_admin@12345';
    END IF;
END
$do$;

CREATE DATABASE control_system OWNER cs_admin;