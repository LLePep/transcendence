NAME = transcendence

all: env build up

env:
	@if [ ! -f .env ]; then cp .env.example .env && echo "[Makefile] .env créé automatiquement à partir de .env.example"; fi

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

restart: down up

clean:
	docker compose down -v --remove-orphans

fclean:
	docker compose down -v --rmi all --remove-orphans

re: fclean all

.PHONY: all env build up down logs ps restart clean fclean re
