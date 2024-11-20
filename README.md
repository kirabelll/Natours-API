# Natous Back End API

This is the back-end API for the Natous project, built using Node.js and Express.js. The API provides robust endpoints to manage data and facilitate communication between the front end and the database.

## Features


- RESTful API design
- Authentication and authorization
- CRUD operations for resources
- Integrated with a database (e.g., MongoDB, PostgreSQL, etc.)
- Middleware for request validation and error handling
- Logging and debugging utilities


## Requirements


- Node.js (version 14.x or higher)
- npm
- Database (MongoDB.)
- A code editor (e.g., VSCode)


### Clone the Repository

To run tests, run the following command

```bash
 git clone https://github.com/kirabelll/Natours-API.git
cd natous-API
```

### Install dependencies:


```bash
npm install
```

### Set up environment variables: Create a .env file in the root directory and add the following:


```bash
PORT= 5000
DATABASE_URL=your_database_connection_url
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=your_jwt_EXPIRES_DAY
JWT_COOKIE_IN=your_jwt_COOKIE_
```

### Start the server:

```bash
npm start

```
## API Reference

#### Get all users

```http
  GET /api/v1/users
```

| Parameter | Type     | resources               | No             |
| :-------- | :------- | :------------------------- |----------------|
| `GET` | `/api/v1/users` | Create a new resource |   Yes             |
| `POST`|  `/api/v1/users ` | Get a resource by ID | No              |
| `GET`|  `/api/v1/users/:id ` | Get a resource by ID | No              |
| `PATCH`|  `/api/v1/users/:id` |Update a resource | Yes            |
| `DELETE`|  `/api/v1/users/:id ` | Delete a resource| Yes              |


## Dependencies

- Node.js: Runtime environment
- Express.js: Web framework
- Mongoose or Sequelize: ORM for database interaction
- JWT: For authentication
- Dotenv: Environment variable management
- Body-parser: Parsing incoming request bodies


