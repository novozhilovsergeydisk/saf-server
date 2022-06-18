psql -f install.sql -U postgres
PGPASSWORD=cs_admin@12345 psql -d control_system -f structure.sql -U cs_admin
# PGPASSWORD=cs_admin psql -d control_system -f data.sql -U cs_admin