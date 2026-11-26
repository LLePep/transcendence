COMPOSE = docker compose -f docker-compose.yaml

all:
	$(COMPOSE) up -d --build

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

clean:
	$(COMPOSE) down --rmi all

fclean:
	$(COMPOSE) down --rmi all -v

re: fclean all

.PHONY: all up down logs clean fclean re
