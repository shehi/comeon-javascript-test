#!/usr/bin/env bash

if [[ -z ${COMPOSE_PROJECT_NAME+x} ]]; then
    export COMPOSE_PROJECT_NAME=comeonjavascripttest_;
fi;

docker-compose build;

docker-compose down;
docker-compose up -d;
docker-compose ps;

echo "┌────────────────────────────────────┐";
echo "│    CONNECT AT http://$(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${COMPOSE_PROJECT_NAME}nginx_1)    │";
echo "└────────────────────────────────────┘";

docker exec ${COMPOSE_PROJECT_NAME}node_1 bash -c "
    npm update;

    chown -R 1000:1000 ./;
";

#stty cols 239 rows 61;
#docker-compose down;
docker container prune -f;
docker network prune -f;
docker volume prune -f;
docker image prune -f;
