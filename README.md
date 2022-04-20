# ExpressAPI
## 📝 Description
This repo is a simple Node.js API with JWT and full CRUD capabilities. Built with **Express** for the routing, **Tedious** for the DB-connection and **Joi** for data validation. The automatic testing is done using **Mocha** and **Chai-HTTP**.

## 💾 Tables
The CRUD operations are all centered around a customer table of the following form:
```sql
create table sales.customers (
    customer_id int identity primary key,
    first_name  varchar(255) not null,
    last_name   varchar(255) not null,
    phone       varchar(25),
    email       varchar(255) not null,
    street      varchar(255),
    city        varchar(50),
    state       varchar(25),
    zip_code    varchar(5)
)
```
And a user table for the validation:
```sql
create table user_info (
    email     varchar(255) not null primary key,
    hash_pass varchar(255) not null
)
```

The hash_pass entries are encrypted using **bcrypt**.

## 📤 Endpoints
```
/customer
    get    /:id
    delete /:id
    put    /:id
    post   /

/auth
    post   /login
    post   /refresh
    post   /logout
```

## ⚙️ Setup
In order to use the project with SQL Server, you should add a `db/config.json` file with:
```json
{  
    "server": "your.server.net", 
    "authentication": {
        "type": "default",
        "options": {
            "userName": "your_username", 
            "password": "your_password" 
        }
    },
    "options": {
        "trustServerCertificate": false,
        "encrypt": true,
        "database": "your_DB"
    }
} 
```
And a `.env` file with two token secrets:
```
ACCESS_TOKEN_SECRET=secret_one
REFRESH_TOKEN_SECRET=secret_two
```
You can generate a token secret like so:
```js
console.log(require('crypto').randomBytes(64).toString('hex'))
```
## 🏄‍♂️ Usage
You can start the API with `npm start` or run the testing suite with `npm test`. **Morgan** (logging of responses) is turned off during testing. 
