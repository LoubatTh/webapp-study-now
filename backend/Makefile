.PHONY: help

help:
	@echo "T-WEB-600 backend Tasks"
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*: *.*## *" | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ""

init: ## Init application
	docker exec -it backend php artisan key:generate;
	make migrate;

migrate: ## Run migration
	docker exec -it backend php artisan migrate;

cache: ## Clear cache
	docker exec -it backend php artisan optimize:clear;

reload-schema: ## Reload migrations to update db schema
	docker exec -it backend php artisan migrate:refresh;