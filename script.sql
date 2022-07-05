-- crm

SELECT * FROM current_catalog
;


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

/*
SELECT * FROM crm.clients
ORDER BY id desc
;

SELECT * FROM crm.records;
SELECT * FROM crm.recordspay;
SELECT * FROM crm.scheduleclients;
SELECT * FROM crm.clients;
SELECT * FROM crm.breeds;
SELECT * FROM crm.animals_category;
SELECT * FROM crm.services;
SELECT * FROM crm.roles;
SELECT * FROM crm.users;

SELECT rp.id, rp.__date__, rp.__sum__, c.name client_name, s.name service_name FROM crm.recordspay rp
JOIN crm.records r on r.id = rp.record_id
JOIN crm.clients c on c.id = r.client_id
JOIN crm.services s on s.id = r.service_id
;

SELECT '12.34'::float8::numeric::money
;

SELECT '52093.89'::money::numeric::float8
;

SELECT '12.34'::float8
;

SELECT '12.34'::float8::numeric
;

SELECT '12.34'::money
;
*/










