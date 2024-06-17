# Setup Laravel

1. Create a file .env at the project's root :

```bash
POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_DB=app
```

2. Create a file .env at backend/ :

   Copy the .env.example file and rename it .env

3. Generate the Laravel key :

   Go to backend folder

```bash
php artisan key:generate
```

4. Install composer packages :

   Go to backend folder

```bash
composer install
```

4. Enter the database container :

```bash
docker compose exec database psql -U root -d app
```

5. Give permissions to your user :

```bash
GRANT ALL PRIVILEGES ON DATABASE app TO root;
GRANT ALL PRIVILEGES ON SCHEMA public TO root;
```

6. Migrate the structure tables :

```bash
docker compose exec backend php artisan migrate
```

7. Restart Docker

You can see Laravel launched at http://localhost:8000 and adminer at http://localhost:8080
