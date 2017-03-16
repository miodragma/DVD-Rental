var express = require('express');
var router = express.Router();
var pg = require('pg');
var bodyParser = require('body-parser');
var parseUrlencoder = bodyParser.urlencoded({extended: false});

var connectionString = "pg://postgres:postgres@localhost:5432/dvdrental";

var config = {
    user: 'postgres', //env var: PGUSER
    database: 'dvdrental', //env var: PGDATABASEt
    password: 'postgres', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10 // max number of clients in the pool
};

var pool = new pg.Pool(config);

router.get('/tableList', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err)
            return console.log(err);
        client.query("SELECT * FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema = 'public' AND table_name NOT IN " +
            "('film_actor', 'film_category', 'inventory', 'items', 'language', 'store') ORDER BY table_name ", function (err, result) {
            done(err);
            if (err)
                return console.log(err);
            res.send(result)
        })
    })
});var tableInput;
function checkTable() {
    if (tableInput === 'actor'){return "actor.first_name, actor.last_name, film.title, actor.last_update, actor.actor_id FROM " + tableInput + " INNER JOIN film_actor on film_actor.actor_id = actor.actor_id " +
        "INNER JOIN film on film.film_id = film_actor.film_id";}
    else if (tableInput === 'address'){return "address.address, city.city, address.district, address.postal_code, address.phone, address.last_update, address.address_id FROM " + tableInput + "" +
        " INNER JOIN city on address.city_id = city.city_id";}
    else if (tableInput === 'category'){return "category.name, film.title, category.last_update, category.category_id FROM " + tableInput + " INNER JOIN film_category on film_category.category_id = category.category_id " +
        "INNER JOIN film on film_category.film_id = film.film_id";}
    else if (tableInput === 'city'){return "city.city, country.country, city.last_update, city.city_id FROM " + tableInput + " INNER JOIN country on country.country_id = city.country_id";}
    else if (tableInput === 'country'){return "country, last_update, country_id FROM " + tableInput;}
    else if (tableInput === 'customer'){return "customer.first_name, customer.last_name, address.address, address.district, customer.email, customer.last_update, customer.customer_id FROM " + tableInput + " " +
        "INNER JOIN address on address.address_id = customer.address_id";}
    else if (tableInput === 'film'){return "film.title, film.rating, film.length, language.name as language, film.rental_duration, film.rental_rate, film.replacement_cost, film.last_update, " +
        "film.film_id FROM " + tableInput + " INNER JOIN language on language.language_id = film.language_id";}
    else if (tableInput === 'payment'){return "CONCAT(staff.first_name ,' ', staff.last_name) as Staff_Name, CONCAT(customer.first_name, ' ', customer.last_name) AS Customer_Name, payment.amount, payment.payment_date, " +
        "rental.rental_date, rental.return_date, payment.payment_id FROM " + tableInput + " INNER JOIN customer on customer.customer_id = payment.customer_id " +
        "INNER JOIN rental on rental.rental_id = payment.rental_id INNER JOIN staff on staff.staff_id = payment.staff_id";}
    else if (tableInput === 'rental'){return "rental.rental_date, rental.return_date, film.title, CONCAT(customer.first_name, ' ', customer.last_name) AS Customer_Name, " +
        "CONCAT(staff.first_name ,' ', staff.last_name) as Staff_Name, rental.last_update, rental.rental_id FROM " + tableInput + " INNER JOIN customer on customer.customer_id = rental.customer_id " +
        "INNER JOIN inventory on inventory.inventory_id = rental.inventory_id INNER JOIN film on film.film_id = inventory.film_id INNER JOIN staff on staff.staff_id = rental.staff_id";}
    else if (tableInput === "staff"){return "staff.first_name, staff.last_name, address.address, staff.email, staff.username, staff.password, staff.last_update, staff.staff_id FROM " + tableInput + " " +
        "INNER JOIN address on staff.address_id = address.address_id";}
}
router.get('/tableResult', function (req, res) {
    tableInput = req.query['table'];
    pool.connect(function (err, client, done) {
        if (err)
           return console.log(err);
        client.query("SELECT " + checkTable(), function (err, result) {
             done(err);
             if(err)
                return console.log(err);
             res.send(result)
        })
    })
});
function checkTable1() {
    if (tableInput === 'actor'){return "actor.first_name, actor.last_name, film.title, actor.last_update, actor.actor_id";}
    else if (tableInput === 'address'){return "address.address, city.city, address.district, address.postal_code, address.phone, address.last_update, address.address_id";}
    else if (tableInput === 'category'){return "category.name, film.title, category.last_update, category.category_id";}
    else if (tableInput === 'city'){return "city.city, country.country, city.last_update, city.city_id";}
    else if (tableInput === 'country'){return "country, last_update, country_id";}
    else if (tableInput === 'customer'){return "customer.first_name, customer.last_name, address.address, address.district, customer.email, customer.last_update, customer.customer_id";}
    else if (tableInput === 'film'){return "film.title, film.rating, film.length, language.name as language, film.rental_duration, film.rental_rate, film.replacement_cost, film.last_update, film.film_id";}
    else if (tableInput === 'payment'){return "staff.first_name , staff.last_name, customer.first_name, customer.last_name, payment.amount, payment.payment_date, rental.rental_date, rental.return_date, payment.payment_id";}
    else if (tableInput === 'rental'){return "film.title, rental.rental_date, rental.return_date, customer.first_name, customer.last_name, staff.first_name, staff.last_name, rental.last_update, rental.rental_id";}
    else if (tableInput === "staff"){return "staff.first_name, staff.last_name, address.address, staff.email, staff.username, staff.password, staff.last_update, staff.staff_id";}
}
router.get('/columnResult', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err)
          return console.log(err);
        client.query("SELECT " + checkTable() + " ORDER BY " + req.query['orderColumn'] + " " + req.query['ascDesc'] + " OFFSET " + req.query['offsetRows'] + " " +
                "ROWS FETCH NEXT " + req.query['nextRows'] + " ROWS ONLY "  , function (err, result) {
             done(err);
             if (err)
                 return console.log(err);
             res.send(result)
        })
    })
});
router.get('/searchTable', function (req, res) {
   pool.connect(function (err, client, done) {
       if (err)
         return console.log(err);
           client.query("SELECT " + checkTable() + " WHERE CONCAT_WS(" + checkTable1() + ") ILIKE '%" + req.query['searchTable'] + "%' ORDER BY " + req.query['orderColumn'] + " " + req.query['ascDesc'] + " OFFSET " + req.query['offsetRows'] + " " +
               "ROWS FETCH NEXT " + req.query['nextRows'] + " ROWS ONLY ", function (err, result) {
               done(err);
               if (err)
                 return console.log(err);
               res.send(result)
       })
   })
});
function set() {
    if (tableInput === "actor"){return " SET first_name = '" + body.first_name + "', last_name = '" + body.last_name + "' WHERE " + body.actor_id}
    else if (tableInput === 'address'){return " SET address = '" + body.address + "', city = '" + body.city + "', district = '" + body.district + "', postal_code = '" + body.postal_code + "', " +
        "phone = '" + body.phone + "' WHERE " + body.address_id}
    else if (tableInput === 'category'){return " SET name = '" + body.name + "' WHERE " + body.category_id}
    else if (tableInput === 'city'){return " SET city = '" + body.city + "' WHERE " + body.city_id}
    else if (tableInput === 'country'){return " SET country = '" + body.country + "' WHERE " + body.country_id}
    else if (tableInput === 'customer'){return " SET first_name = '" + body.first_name + "', last_name = '" + body.last_name + "', email = '" + body.email + "' WHERE " + body.customer_id}
    else if (tableInput === 'film'){return " SET title = '" + body.title + "', rating = '" + body.rating + "', length = '" + body.length + "', rental_duration = '" + body.rental_duration + "'," +
        " rental_rate = '" + body.rental_rate + "', replacement_cost = '" + body.replacement_cost + "' WHERE " + body.film_id}
    else if (tableInput === 'payment'){return " SET amount = '" + body.amount + "' WHERE " + body.payment_id}
    else if (tableInput === 'rental'){return " SET rental_date = '" + body.rental_date + "', return_date = '" + body.return_date + "' WHERE " + body.rental_id}
    else if (tableInput === 'staff'){return " SET first_name = '" + body.first_name + "', last_name = '" + body.last_name + "', email = '" + body.email + "', username = '" + body.username + "', password = '" + body.password + "' " +
        "WHERE " + body.staff_id}
}
   var body;
router.post('/update',parseUrlencoder, function (req, res) {
    body = req.body;
    pool.connect(function (err, client, done) {
        if (err)
           return console.log(err);
            client.query("UPDATE " + tableInput + set(), function (err, result) {
                done(err);
                if (err)
                   return console.log(err);
            res.send(result)
        })
    })
});
module.exports = router;