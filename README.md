# Logistics and Delivery Management Platform

## Introduction

This project aims to develop a scalable logistics and delivery management platform with enhanced features. Users can schedule shipments, track deliveries in real-time, and customize their delivery preferences. The platform supports authentication with "Admin" and "User" roles.

## Project Requirements

- **Authentication:** JWT-based authentication.
- **Functionality:**
  - Public APIs: Sign up, sign in, schedule a new shipment, track shipment status, update delivery preferences.
  - Admin APIs: Disable/enable user accounts, manage shipments.
  - User APIs: View scheduled shipments, track shipment status, update delivery preferences, cancel scheduled shipments, provide feedback on delivered shipments.
- **Scalability Considerations:** Handle high data input and support a large number of concurrent users.
- **Technologies & Libraries:**
  - Database: MongoDB or MySQL with Mongoose ORM or Sequelize ORM.
  - Web Application Framework: NestJS for TypeScript support and modular structure.
  - Message Broker: Kafka for handling real-time shipment tracking events.
  - Caching: Redis for caching shipment data or real-time updates.

## Local Setup

If you encounter issues with Docker or prefer to set up the services manually, you can follow these steps to set up MongoDB, Kafka, and Redis locally.

### MongoDB

1. Install MongoDB by following the instructions provided on the [official MongoDB documentation](https://docs.mongodb.com/manual/installation/).
2. Start MongoDB by running the `mongod` command in your terminal.

### Kafka and Zookeeper

1. Install Kafka and Zookeeper by following the instructions provided on the [official Kafka documentation](https://kafka.apache.org/quickstart).
2. Start Zookeeper by running the `zookeeper-server-start.sh` script.
3. Start Kafka by running the `kafka-server-start.sh` script.

### Redis

1. Install Redis by following the instructions provided on the [official Redis documentation](https://redis.io/download).
2. Start Redis by running the `redis-server` command in your terminal.

Once you have MongoDB, Kafka, and Redis running locally, you can proceed with setting up and running the project.

## Docker Setup

1. Install Docker and Docker Compose on your machine.
2. Clone this repository to your local machine.
3. Navigate to the project directory in your terminal.
4. Run `docker-compose up` to start the containers.

## Running the Application

1. Install dependencies by running `npm install`.
2. Start the NestJS server by running `npm run start:dev`.

## API Documentation

After starting the server, you can import the provided Postman collection located in the `postman` directory to explore and interact with the API endpoints.

## Contributors

- [Ibrahim Ajarmeh](https://github.com/johndoe)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
