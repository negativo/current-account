**_Current Account Example Project_**

This project exposes various endpoints to:

- create/read/update/delete/authenticate a customer
- create/read/update/delete a current account
- create/read/delete a transaction

and an 'Insomnia' export is provided to be used to check out the endpoints.

The main endpoints are:

- `POST /api/v1/accounts` providing Auth token and body as ```{ customerId: _some id_, initialCredit: 2000} to create a current account.
- `GET /api/v1/accounts` providing Auth token to get all the accounts and transactions for the logged in customer.

Some points of improvement are:

- Encrypt the customer/account/transactions id sent in the http requests using (eg. using Hashids lib).
- Move all the text and numeric constants in a separate configuration file.

**Features**

- Graceful Shutdown, HealthCheck, SQL Database & Migrations, Authentication, Validation, Integration & Unit Testing, Git Hook

## Installation

- _npm install_ - Install dependencies

### Running with Docker

- _docker-compose up_ (compose and run, it also creates the mysql database)
- _docker-compose down_ (Destroy application and mysql containers)

## Running tests

- _npm run test_ - Run unit tests
- _npm run test:integration_ - Run integration tests
- _npm run test:all_ - Run Unit and Integration tests
