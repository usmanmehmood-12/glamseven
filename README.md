#  Building Microservices with NestJS, Docker Compose, Postgres, and Kafka

## To run the services:

In the root directory you need to run the command:

### `docker-compose build`
### `docker-compose start`

This will run the user-service, product-service & order-service on docker.

Add the below .env in each of the user-service,product-service & order-service folder before running the above docker commands.
### ***Env:***
```bash
DATABASE_HOST=postgresdb
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=ecommerce
```

All of the tasks are implemented in the repo along with the CRUD operations.

### ***Tasks implemented:***

1) Task 1: Microservices Setup
2) Task 2: Docker Compose Configuration
3) Task 3: Database Design
4) Task 4: Kafka Integration

