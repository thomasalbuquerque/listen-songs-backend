# Listen Songs Backend

## Description

This is the repository of Listen Songs Backend, to serve Listen Songs App.

## How to run this server locally

1. Run `yarn` to install all dependencies;
2. Update the .env file with the correct values, with JWT values being any string, and the database values being the correct values for your postgres database;
3. Run `docker compose up -d` to start Docker Desktop and required containers declared in docker-compose.yml;
4. Run `yarn generate` to generate the prisma client in the node_modules folder;
5. Run `yarn migrate` to run the migrations and create the tables in the database;
6. Run `yarn start:dev` to run the project locally. It should start at `localhost:4444`. This will be the base url to call the routes.

## API Documentation

To access API Documentation you should open your browser and access this URL: localhost:4444/docs