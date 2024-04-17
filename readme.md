# How to run

## Install all the dependencies in each services

1. cd backend && npm install  
2. cd frontend && npm install

## Copy the .env.example to .env in each services (i have set the .env.example default values to match with the docker configurations so this should work out of the box)

1. cp backend/.env.example backend/.env  
2. cp frontend/.env.example frontend/.env

## Run all services (from the root dir)

1. docker compose up -d