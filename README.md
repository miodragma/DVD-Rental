# DVD Rental
,,DVD Rental’’ is a web application with a jQuery frontend and Express.js 
backend. The backend uses the PostgreSQL sample database ,,DVD rental”.
The user can search database tables and view all columns and rows of a table
with a search functionality by each column value. There are order buttons in the 
table header to order by descending and ascending value. Each row at the end 
has an edit button that shows form inputs with validation, placed inside a 
bootstrap modal. The user can update and save values to the database.  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

1. Download this repository.
2. Download and install Node.js  ``` https://nodejs.org/en/ ```
3. Download and install PostgreSql ``` https://www.postgresql.org/download/ ``` 
4. Download and install pgAdmin 3 or 4 ``` https://www.pgadmin.org/download/ ```

### Installing

Assuming you’ve already installed Node.js, create a directory to hold DVD Rental application.
``` 
$ mkdir myapp
$ cd myapp
```
Use the npm init command to create a package.json file for your application. For more information on how package.json works, see ``` https://docs.npmjs.com/files/package.json ```.
To create a package.json run:

``` 
$ npm init
```

This command prompts you for a number of things, such as the name and version of your application. For now, you can simply hit RETURN to accept the defaults for most of them, with the following exception:

```
entry point: (index.js)
```
Enter app.js
 
```
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```
 Now install: 
 * Express, web framework for node.js.
 * Body-parser, node.js body parsing middleware.
 * Morgan, HTTP request logger middleware for node.js.
 * Nodemon, will watch the files in the directory and if any files change, will automatically restart your node application.
 * Path, is an exact copy of the NodeJS ’path’ module published to the NPM registry.
 * Pg, non-blocking PostgreSQL client for node.js. Pure JavaScript and optional native libpq bindings.

in the myapp directory and save it in the dependencies list. For example:

```
$ npm install express body-parser morgan nodemon path pg --save
```
In scripts type ``` nodemon app.js ``` to start with nodemon and ``` xdg-open http://localhost:3000 ``` to open browser when you run application.

End of create package.json
```
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "xdg-open http://localhost:3000 && nodemon app.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.16.0",
    "express": "^4.14.1",
    "morgan": "^1.8.0",
    "nodemon": "^1.11.0",
    "path": "^0.12.7",
    "pg": "^6.1.2"
  }
}


```
 Next download and install:
 1. PostgreSQL 
    1. Download link: ``` https://www.postgresql.org/download/ ```
    2. Install example: ``` http://www.postgresqltutorial.com/install-postgresql/ ```
 2. PgAdmin
    1. Download link: ``` https://www.pgadmin.org/download/ ```
    2. Load PostgreSQL Sample Database link: ``` http://www.postgresqltutorial.com/load-postgresql-sample-database/ ```
 3. DVD Rental database
    1. myapp/db/dvdrental.tar
    2. or download link: ``` http://www.postgresqltutorial.com/postgresql-sample-database/ ```



### Start

Go to myapp directory and use the ``` npm start ``` command to start DVD Rental application.
