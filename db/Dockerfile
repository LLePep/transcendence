FROM debian:trixie-slim

# Empêche Debian de créer un cluster "main" à l'installation : echo "create_main_cluster = false" > /etc/postgresql-common/createcluster.conf
RUN mkdir -p /etc/postgresql-common \
    && echo "create_main_cluster = false" > /etc/postgresql-common/createcluster.conf \
    && apt-get update \
    && apt-get install -y --no-install-recommends postgresql \
    && rm -rf /var/lib/apt/lists/*

# creation de variables d'environnement pour le service
ENV PATH=/usr/lib/postgresql/17/bin:$PATH \
    PGDATA=/var/lib/postgresql/data

# creation et droit utilisateur
RUN mkdir -p "$PGDATA" /var/run/postgresql \
    && chown -R postgres:postgres "$PGDATA" /var/run/postgresql \
    && chmod 700 "$PGDATA"

COPY script.sh /usr/local/bin/script.sh
RUN chmod +x /usr/local/bin/script.sh

USER postgres
EXPOSE 5432

# Arrêt "fast" : coupe les clients connectés proprement au lieu d'attendre
STOPSIGNAL SIGINT

# HEALTHCHECK pour que la connexion du backend ce fasse proprement
HEALTHCHECK --interval=5s --timeout=3s --retries=10 \
    CMD pg_isready -h 127.0.0.1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" || exit 1

ENTRYPOINT ["script.sh"]
