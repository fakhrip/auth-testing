# How to run

1. Install all the dependencies in each services

```
cd backend && npm install  
cd frontend && npm install
```

2. Copy the .env.example to .env in each services (i have set the .env.example default values to match with the docker configurations so this should work out of the box)

```
cp backend/.env.example backend/.env  
cp frontend/.env.example frontend/.env
```

> Note: for service account i might only be able to give via personal contact for a sample one

3. Run all services (from the root dir)

```
docker compose up -d
```