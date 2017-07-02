var express = require('express');
var passport = require('passport');
// var Account = require('../models/account.js')
var router = express.Router();

//POSTGRESS DATABASE
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

router.post('/api/v1/todos', function (req, res) {
	var results = [];

	//grab data from https request
	var data = {text: req.body.text, complete: false};

	//Get postgres Client from the connetion pool
	pg.connect(connectionString, function(err, client, done) {
		//SQL Query > Insert data
		client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

		//SQL Query select data
		var query = client.query("SELECT * FROM items ORDER BY id ASC");

		// Stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});

		//After all data is returned, close connection and return results
		query.on('end', function() {
			client.end();
			return res.json(results);
		});

		//Handle errors
		if(err) {
			console.log(err);
		}
	});
});

router.get('/api/v1/todos', function (req, res) {
	var results = [];

	//Get postgres client from the connection tool
	pg.connect(connectionString, function(err, client, done) {
		//SQL Query > Select Data
		var query = client.query("SELECT * FROM items ORDER BY id ASC");

		//Stream results back one row at a time
		query.on('row', function (row) {
			results.push(row);
		});

		//After all results are returned close connection 
		query.on('end', function() {
			client.end();
			return res.json(results);
		});

		//handle errors
		if(err) {
			console.log(err);
		}
	});
});

router.put('/api/v1/todos/:todo_id', function (req, res) {
	var results = [];

	//grab data from URL parameters
	var id = req.params.todo_id;

	//Grab data from https request
	var data = {text: req.body.text, complete: req.body.complete};

	// Get postgres client from connection pool
	pg.connect(connectionString, function(err, client, done) {

		//SQL Query > Update query
		client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

		//SQL Query > Select query
		var query = client.query("SELECT * FROM items ORDER BY id ASC");

		//Stream results back one at a time
		query.on('row', function(row) {
			results.push(row);
		});

		//After all data is returned, close the connection and return results 
		query.on('end', function() {
			client.end();
			return res.json(results);
		});

		//Handle errors
		if(err) {
			console.log(err);
		}
	});
});

router.delete('/api/v1/todos/:todo_id', function (req, res) {

	var results = [];

	// Grab data from URL parameters
	var id = req.params.todo_id;

	// Get a Postgres client from the connection poll
	pg.connect(connectionString, function(err, client, done) {

		// SQL QUERY > Delete Data
		client.query("DELETE FROM items WHERE id=($1)", [id]);

		//SQL QUERY > Select data
		var query = client.query("SELECT * FROM items ORDER BY id ASC");

		// Stream the results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});

		// After all the results are streamed back close the connection and return the data
		query.on('end', function() {
			client.end;
			return res.json(results);
		});

		// Handle the errors
		if(err) {
			console.log(err);
		}
	});
});

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { user: req.user });
// });

// router.get('/register', function(req, res) {
// 	res.render('register', { });
// });

// router.post('/register', function(req, res) {
// 	Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
// 		if (err) {
// 			console.log(err);
// 			return res.render('register', {info: "Sorry. That username already exists. Try again."});
// 		}

// 		passport.authenticate('local')(req, res, function() {
// 			console.log("logs for register post data");
// 			res.redirect('/');
// 		});
// 	});
// });

// router.get('/login', function(req, res) {
// 	res.render('login', { user : req.user });
// });

// router.post('/login', passport.authenticate('local'), function(req, res) {
// 	res.redirect('/');
// });

// router.get('/logout', function(req, res) {
// 	req.logout();
// 	res.redirect('/');
// });

// router.get('/ping', function(req, res) {
// 	res.status(200).send("pong!!");
// });

module.exports = router;
