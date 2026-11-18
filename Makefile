NAME = transcendence

all: build up

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

.PHONY: all build up down logs ps restart clean fclean re
