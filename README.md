# Setup Laravel

1. Create a file .env at the project's root :

```bash
POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_DB=app
```

2. Create a file .env at backend/ :

   Copy the .env.example file and rename it .env

3. Run containers

```bash
docker compose up --build
```

4. Init backend :

> Initialiazing the backend will generate keys, migrate and seed the db and create the webhook to handle Stripe events.

   Go to backend folder

```bash
make init
```

You can see Laravel launched at http://localhost:8000 and adminer at http://localhost:8080
