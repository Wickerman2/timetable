var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var request = require('request');
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var request = require('request-promise');

//npm run webpack
//npm start

router.post('/')
let accessToken = '';
let tokenTimeLeft = '';

function getAccessToken() {
    var token = '';
    var options = { method: 'POST',
    url: 'https://api.vasttrafik.se/token',
    headers: 
    { 'Content-Type': 'application/x-www-form-urlencoded',
        'Postman-Token': '7d6dda02-a283-4584-b710-8db203074ef9',
        'Cache-Control': 'no-cache',
        Authorization: 'Basic VUFmVExKQ1pmM1JLdDNma3NUc3ZudWRnNnFJYTpDSEIwU01Qal8wMGFPNGVCbDNZUk85ODlvcEFh' },
    form: { grant_type: 'client_credentials', scope: 'device_postman' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var testString = 'inne i request';
        }).then(console.log);
}

function searchStop (aT) {
    console.log(accessToken);
    var options = { method: 'GET',
        url: 'https://api.vasttrafik.se/bin/rest.exe/v2/location.name',
        qs: { input: 'olof', format: 'json' },
        headers: 
        { 'Postman-Token': '0dbdfc0c-96aa-46c1-980c-9e9755dee9fa',
            'Cache-Control': 'no-cache',
            Authorization: 'Bearer ' + aT } };

        request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        });
}

console.log('... Starting server ... ');

getAccessToken();

//console.log('get access token return ' + getAccessToken());
//searchStop(accessToken);

app.use(express.static(__dirname +'./../../')); //serves the index.html
app.listen(3000); //listens on port 3000 -> http://localhost:3000/
