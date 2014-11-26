var express = require('express');
var handlebars  = require('express-handlebars');
var bodyparser = require('body-parser');

var Store = require("jfs");
var datastore = new Store("data");

datastore.get("data", function(err, obj){
	machines = obj || {};
	for (var id in machines) {
		machines[id].online = false;
	}
});

var app = express();
app.use(express.static(__dirname + '/www'));
app.use(bodyparser.json());
app.listen(process.env.PORT || 8080);

app.post("/online", function (req, res) {
	console.log(req.body);
	res.end();
	if (!machines[req.body.mac]) {
		machines[req.body.mac] = {};
		machines[req.body.mac].mac = req.body.mac;
		machines[req.body.mac].created = new Date();
		machines[req.body.mac].started = new Date();
		machines[req.body.mac].stopped = -1;
	}
	else {
		if (machines[req.body.mac].online == false) {
			machines[req.body.mac].started = new Date();
		}
	}
	machines[req.body.mac].lastseen = new Date();
	machines[req.body.mac].ip = req.body.ip;
	machines[req.body.mac].hostname = req.body.hostname;
	machines[req.body.mac].online = true;
	if (offlinetimers[req.body.mac]) {
		clearTimeout(offlinetimers[req.body.mac]);
	}
	offlinetimers[req.body.mac] = setTimeout(function () {
		machines[req.body.mac].online = false;
	}, 15000);
});

app.post("/event/:name", function (req, res) {
	console.log(req.params.name);
	console.log(req.body);
	res.end();
	if (machines[req.body.mac].online && machines[req.body.mac]) {
		machines[req.body.mac].stopped = new Date();
		machines[req.body.mac].online = false;
		machines[req.body.mac].lastseen = new Date();
	}
});

setInterval(function () {
	datastore.save("data", machines, function(err){
		// now the data is stored in the file data/anId.json
	});
}, 10000);

var machines = {

};
var offlinetimers = {

};

// app.get("/", function (req, res) {
// 	// res.render("index");
// });

app.get("/json", function (req, res) {
	var response = {
		machines: machines
	};
	res.write(JSON.stringify(response));
	res.end();
});