## Description

Repository to share my code for the fourth backend challenge from Alura. The objective of this challenge was to develop an API for a financial control app and deploy it.
The deployed version can be accessed on http://104.248.119.154:3000/api

## Requirements

To run this project you will need at least **Docker** and **Docker Compose**. Optionally, you can also have **Git** to clone the repository and **Node.js** to run the project without Docker.

## Running the app

First, download and extract the project folder or directly clone it with **Git**:

```bash
# Will create a folder called Alura-backend-challenge-4 in your current folder
git clone https://github.com/joaomarcosh/Alura-backend-challenge-4
```

After that you access the project directory in the terminal and run it with **Docker Compose**:

```bash
# Change the current folder
cd Alura-backend-challenge-4/

# Run the project with Docker
docker compose up
```

If not using docker you will have to manually set up a database and change the database info in the base .env file provided.

Once the API is up and running you can access it on http://localhost:3000/api for a Swagger UI with the documentaion of the routes.

## The database

It contains 3 tables: *Income*, *Expens*e and *User*. Both the Income and the Expense tables have a many-to-one relation with the User table.

![](https://i.imgur.com/5kC4jtQ.png)

## The API

Basic CRUDs are available for all tables and there are endpoints for accessing a monthly summary of your incomes and expenses, aswell as endpoints for signing up and for login.
Most of the endpoints are protected by a JWT-based authentication system which means you need to be logged in to access the API. There are no restrictions for signing up a new user and once you log in you will receive a JWT token that will be stored in your cookies and will be sent with every request made to the API. In addition, the User endpoints are also protected by a role based authorization system, and can only be accessed by users with the admin role.
A basic documentation of the endpoints is available at `/api`.
