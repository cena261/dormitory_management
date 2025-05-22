@echo off

docker-compose down -v
docker compose -f ./docker-compose.yml up -d
docker-compose up --build

pause
