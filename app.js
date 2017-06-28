var express = require('express');
require('dotenv').config()
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

var error = function (err, response, body) {
    console.log('ERROR [%s]', JSON.stringify(err));
};
var success = function (data) {
    console.log('Data [%s]', data);
};


app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.get('/validate_user/:userName', function(req, res) {
  var params = { screen_name: req.params.userName, include_rts: false, trim_user: true }
  console.log('PARAMS', params);
  return client.get('statuses/user_timeline', params)
  .then(function(response) {
    // console.log('response', response);
  })
  .catch(function(error) {
    console.log('error', error)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
