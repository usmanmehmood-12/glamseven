#  Building Microservices with NestJS, Docker Compose, Postgres, and Kafka

## To run the services:

In the root directory you need to run the command:

### `docker-compose build`
### `docker-compose up`

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

**Note:**
Kafka is implemented in order-service and product-service. When an order is placed/created or edited/updated.

### ***API Endpoints:***

**_POST:_**
1. Add a single user:
[http://localhost:3001](http://localhost:3001/users) .

_request body:_
```bash
  {
      "name":"usman",
      "email":"usman@gmail.com"
  }
```

**_GET:_**
2. Get a single user by user id:
[http://localhost:3001/users:id](http://localhost:3001/users/:id) .

_**GET:**_
3. Get all users:
http://localhost:3001/users

_**PUT**_
4. Edit/Update a user by id:
[http://localhost:3001/users/:id](http://localhost:3001/users/:id)

_request body:_
```bash
  {
      "name":"Malik",
      "email":"malik@gmail.com"
  }

    or

  {
    "name":"Malik",
  }

    or

  {
    "email":"malik@gmail.com"
  }

```

_**DELETE**_
5.  Delete a user by user id:
[http://localhost:3001/users/:id](http://localhost:3001/users/:id)

_**POST**_
6. Add a single product:
[http://localhost:3002/products](http://localhost:3002/products)

_request body:_
```bash
  {
    "name":"iphone",
    "description":"headphones",
    "price":"350",
    "quantity":6
  }
```

_**GET**_
7.  Get a single product by product id:
[http://localhost:3002/products/:id](http://localhost:3002/products/:id)

_**GET**_
8.  Get all products:
[http://localhost:3002/products](http://localhost:3002/products)

_**PUT**_
9.  Edit/ update a product by product id:
[http://localhost:3002/products/:id](http://localhost:3002/products/:id)

_request body:_
```bash
{
    "name":"hp",
    "description":"laptop",
    "price":"350",
    "quantity":6
}
```

_**DELETE**_
10.  remove a product by id
[http://localhost:3002/products/:id](http://localhost:3002/products/:id)

_**POST**_
11.  Add/place an order:
[http://localhost:3003/orders](http://localhost:3003/orders)

_request body:_
```bash
{
  "order": {
    "user_id": 1,
    "date": "2023-09-20"
  },
  "products": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}

or

{
  "order": {
    "user_id": 1,
    "date": "2023-09-20"
  },
  "products": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}

```

_**PUT**_
12.  edit/update product quantity in an order by order id:
[http://localhost:3003/orders/:id](http://localhost:3003/orders/:id)

_request body:_
```bash
{
  "order": {
      "id": 1,
    "user_id": 2,
    "date": "2023-09-20"
  },
  "products": [
    {
      "product_id": 1,
      "quantity": 1
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}

or

{
  "order": {
      "id": 1,
    "user_id": 1,
    "date": "2023-09-20"
  },
  "products": [
    {
      "product_id": 1,
      "quantity": 1
    }
  ]
}

```

_**GET**_
13.  Retrieve an order by an order id:
[http://localhost:3003/orders/:id](http://localhost:3003/orders/:id)

_**GET**_ 
14.  Retrieve all orders:
[http://localhost:3003/orders/](http://localhost:3003/orders/)


_**DELETE**_
15.  Remove an order by order id:
[http://localhost:3003/orders/:id](http://localhost:3003/orders/:id)
