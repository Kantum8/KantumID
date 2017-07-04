import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
/*
  import google from 'googleapis';
  var urlshortener = google.urlshortener('v1');

  var params = {
    shortUrl: 'http://goo.gl/xKbRu3'
  };

  // get the long url of a shortened url
  urlshortener.url.get(params, function (err, response) {
    if (err) {
      console.log('Encountered error', err);
    } else {
      console.log('Long url is', response.longUrl);
    }
  });
*/
clientID = "228KHB";
clientSecret = "f905c6313d7c50fe716164f2468c379d";
callbackURL = "http://localhost:3000";

var express = require("express"),
    app = express();


var FitbitApiClient = require("fitbit-node"),
    client = new FitbitApiClient(clientID, clientSecret);

app.get("/authorize", function (req, res) {
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', callbackURL));
});

app.get("/callback", function (req, res) {
    client.getAccessToken(req.query.code, 'YOUR_CALLBACK_URL').then(function (result) {
        client.get("/profile.json", result.access_token).then(function (results) {
            res.send(results[0]);
        });
    }).catch(function (error) {
        res.send(error);
    });
});









});
