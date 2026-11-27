COMPOSE = docker compose -f docker-compose.yaml

all: env
	$(COMPOSE) up -d --build

env:
	@if [ ! -f .env ]; then cp .env.example .env && echo "[Makefile] Created .env from .env.example"; fi

up: env
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

clean:
	$(COMPOSE) down --rmi all

fclean:
	$(COMPOSE) down --rmi all -v

re: fclean all

.PHONY: all env up down logs ps clean fclean re
