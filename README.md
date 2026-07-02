# E-Commerce Microservices with Saga Pattern

This is a microservices-based e-commerce system that implements data consistency using the Saga Pattern (Choreography) with NestJS, RabbitMQ, PostgreSQL, and Sequelize.

## Architecture

```
graph TD
    Client[Client (Swagger/Postman)] -->|HTTP REST| Gateway[API Gateway]
    
    Gateway -->|create_order (Message)| OrderService[Order Service]
    Gateway -->|create/get_products (Message)| ProductService[Product Service]
    
    OrderService -.->|OrderCreated (Event)| RabbitMQ((RabbitMQ))
    ProductService -.->|StockReserved / StockReservationFailed| RabbitMQ
    PaymentService[Payment Service] -.->|PaymentProcessed / PaymentFailed| RabbitMQ
    
    RabbitMQ -.->|OrderCreated| ProductService
    RabbitMQ -.->|StockReserved| PaymentService
    RabbitMQ -.->|PaymentProcessed/PaymentFailed/StockReservationFailed| OrderService
    RabbitMQ -.->|PaymentProcessed/PaymentFailed/StockReservationFailed| NotificationService[Notification Service]
```

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/) or npm

## Setup & Running

1. **Start Infrastructure:**
   Run the following command to start PostgreSQL (with 4 databases) and RabbitMQ.
   ```bash
   docker-compose up -d
   ```

2. **Install Dependencies:**
   ```bash
   yarn install
   ```

3. **Start Microservices:**
   You can start each service in a separate terminal:
   ```bash
   yarn start api-gateway
   yarn start product-service
   yarn start order-service
   yarn start payment-service
   yarn start notification-service
   ```

## Swagger UI

Once the API Gateway is running, you can access the Swagger UI documentation at:
**[http://localhost:3000/api](http://localhost:3000/api)**

## Testing the Saga Flow

You can use the Swagger UI, the included `test-scenarios.http` file (with VS Code REST Client), or Postman.

### 1. Seed Data (Create a Product)
**POST** `/products`
```json
{
  "name": "Gaming Laptop",
  "description": "High performance",
  "stock": 10
}
```

### 2. Happy Path (Order Success)
**POST** `/orders`
```json
{
  "total_amount": 1500,
  "details": [
    {
      "product_id": "<PRODUCT_UUID_HERE>",
      "amount": 2
    }
  ]
}
```

### 3. Sad Path (Insufficient Stock)
**POST** `/orders`
```json
{
  "total_amount": 1500,
  "details": [
    {
      "product_id": "<PRODUCT_UUID_HERE>",
      "amount": 20
    }
  ]
}
```

### 4. Sad Path (Payment Fails)
Simulated by sending `total_amount > 5000` (ensure stock is sufficient).
**POST** `/orders`
```json
{
  "total_amount": 6000,
  "details": [
    {
      "product_id": "<PRODUCT_UUID_HERE>",
      "amount": 1
    }
  ]
}
```

### 5. Verify Orders
**GET** `/orders`
Check the `status` of each order to see if they correctly transitioned to `SUCCESS` or `FAILED`.
