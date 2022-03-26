# ExpressAPI-AzureDB
This repo is a simple Node.js API with full CRUD capabilities. Built with Express for the routing, Tedious for the DB-connection and Joi for data validation.
The automatic testing is done using Mocha and Chai-HTTP. In order to use the project with a Azure SQL database, you should add a `./db/config.json` file with:
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
