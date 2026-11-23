#!/bin/bash
set -euo pipefail

# Check des variables d'env
: "${POSTGRES_USER:?POSTGRES_USER manquant}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD manquant}"
: "${POSTGRES_DB:?POSTGRES_DB manquant}"

# Premier démarrage uniquement, on le check grace a ce fichier PG_VERSION qui est la version de postgresql
# Les tables ne vont PAS ici : elles sont créées par les migrations du backend.
if [ ! -s "$PGDATA/PG_VERSION" ]; then
    echo "[db] Initialisation de la base dans $PGDATA"

    initdb -D "$PGDATA" \
        --username=postgres \
        --encoding=UTF8 \
        --auth-local=peer \
        --auth-host=scram-sha-256

    # Accepter les connexions du réseau Docker (avec mot de passe)
    echo "listen_addresses = samenet" >> "$PGDATA/postgresql.conf"
    echo "host all all all scram-sha-256" >> "$PGDATA/pg_hba.conf"

    # Serveur temporaire, uniquement en socket local, pour créer user + db
    pg_ctl -D "$PGDATA" -o "-c listen_addresses=''" -w start

    psql -v ON_ERROR_STOP=1 --username=postgres --dbname=postgres \
        --set=user="$POSTGRES_USER" \
        --set=pass="$POSTGRES_PASSWORD" \
        --set=db="$POSTGRES_DB" <<'EOSQL'
CREATE ROLE :"user" WITH LOGIN PASSWORD :'pass';
CREATE DATABASE :"db" OWNER :"user";
EOSQL

    pg_ctl -D "$PGDATA" -m fast -w stop
    echo "[db] Initialisation terminée"
fi

# exec pour que le PID1 devienne postgres et onspecifie le directorie de reference
exec postgres -D "$PGDATA"
