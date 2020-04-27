// Importation des modules
var path = require('path');

// var, const, let :
// https://medium.com/@vincent.bocquet/var-let-const-en-js-quelles-diff%C3%A9rences-b0f14caa2049

const mqtt = require('mqtt')
// Topics MQTT
const TOPIC_LIGHT = 'sensors/light'
const TOPIC_TEMP = 'sensors/temp'
//const TOPIC_LED = 'sensors/led'

// express 
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//Pour permettre de parcourir les body des requetes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function (request, response, next) { //Pour eviter les problemes de CORS/REST
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "*");
	response.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
	next();
});

// MongoDB
var mongodb = require('mongodb');
const mongoBaseName = "lucioles"                   // Nom de la base
//const uri = 'mongodb://localhost:27017/'; //URL de connection
//const uri = 'mongodb://10.9.128.189:27017/'; //URL de connection		
const uri = "mongodb://vincenzo:clementvincent1373@cluster0-shard-00-00-ipalw.gcp.mongodb.net:27017,cluster0-shard-00-01-ipalw.gcp.mongodb.net:27017,cluster0-shard-00-02-ipalw.gcp.mongodb.net:27017/test?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin";


const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connection a la DB MongoDB 
client.connect(function (err, mongodbClient) {
	//if (err) throw err;
	if (err) console.log("pas de co");
	// If connection to DB failed ... 
	// else we get a "db" engine reference

	//===============================================    
	// Get a connection to the DB "lucioles" or create
	//
	var dbo = client.db(mongoBaseName);


	dbo.collection('temp').deleteMany({}, function (err, delOK) {
		if (err) console.log("pas de co");
		if (delOK) console.log("Collection deleted");
	});

	dbo.collection('light').deleteMany({}, function (err, delOK) {
		if (err) console.log("pas de co");
		if (delOK) console.log("Collection deleted");
	});


	//===============================================
	// Connection au broker MQTT distant
	//
	//const mqtt_url = 'http://192.168.1.100:1883' ///134.59.131.45:1883'
	const mqtt_url = 'http://broker.hivemq.com'
	var client_mqtt = mqtt.connect(mqtt_url);

	//===============================================
	// Des la connection, le serveur NodeJS s'abonne aux topics MQTT 
	//
	client_mqtt.on('connect', function () {
		client_mqtt.subscribe(TOPIC_LIGHT, function (err) {
			if (!err) {
				//client_mqtt.publish(TOPIC_LIGHT, 'Hello mqtt')
				console.log('Node Server has subscribed to ', TOPIC_LIGHT);
			}
		})
		client_mqtt.subscribe(TOPIC_TEMP, function (err) {
			if (!err) {

				//client_mqtt.publish(TOPIC_TEMP, JSON.stringify({name:'Hello'}))
				console.log('Node Server has subscribed to ', TOPIC_TEMP);
			}

		})
	})

	//================================================================
	// Callback de la reception des messages MQTT pour les topics sur
	// lesquels on s'est inscrit.
	// C'est cette fonction qui alimente la BD.
	//
	client_mqtt.on('message', async function (topic, message) {
			console.log("MQTT msg on topic : ", topic.toString());
			console.log("Msg payload : ", message.toString());

		const topicname = path.parse(topic.toString()).base;

		// Parsing du message suppos� recu au format JSON
		message = JSON.parse(message);
		wh = message.who
		val = message.value

	}) // end of 'message' callback installation


	//================================================================
	// Fermeture de la connexion avec la DB lorsque le NodeJS se termine.
	//
	process.on('exit', (code) => {
		if (mongodbClient && mongodbClient.isConnected()) {
			// console.log('mongodb connection is going to be closed ! ');
			mongodbClient.close();
		}
	})

	//================================================================
	//==== REQUETES HTTP reconnues par le Node =======================
	//================================================================


	/*app.post('/esp/led', function (req, res) {
		client_mqtt.publish(TOPIC_LED, JSON.stringify(req.body));
		res.send("OK");
	})*/

	app.get('/esp/:what', function (req, res) {
		// cf https://stackabuse.com/get-query-strings-and-parameters-in-express-js/
		console.log(req.originalUrl);

		wh = req.query.who // get the "who" param from GET request
		// => gives the Id of the ESP we look for in the db	
		wa = req.params.what // get the "what" from the GET request : temp or light ?

		/* 	console.log("\n--------------------------------");
			console.log("A client/navigator ", req.ip);
				console.log("sending URL ",  req.originalUrl);
			console.log("wants to GET ", wa);
			console.log("values from object ", wh); */

		const nb = 200; // R�cup�ration des nb derniers samples
		// stock�s dans la collection associ�e a ce
		// topic (wa) et a cet ESP (wh)
		key = wa
		//dbo.collection(key).find({who:wh}).toArray(function(err,result) {
		dbo.collection(key).find({ who: wh }).sort({ _id: -1 }).limit(nb).toArray(function (err, result) {
			if (err) throw err;
			/*   console.log('get on ', key);
			  console.log(result); */
			res.json(result.reverse()); // This is the response.
			/*   console.log('end find'); */
		});
		/* 	console.log('end app.get'); */
	});

});// end of MongoClient.connect


// L'application est accessible sur le port 3000
app.listen(3000, () => {
	console.log('Server listening on port 3000');
});
