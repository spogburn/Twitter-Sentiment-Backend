const express = require('express');
require('dotenv').config()
const app = express();
const request = require('request-promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const Twitter = require('twitter');
const port = process.env.PORT || 3000;
const client = new Twitter({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});
// Google Cloud Language
const Language = require('@google-cloud/language');
const language = Language();

app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/validate_user/:userName', function(req, res) {
  const params = { screen_name: req.params.userName, include_rts: 1, trim_user: true, exclude_replies: true, count: 200 }
  return client.get('statuses/user_timeline', params)
  .then(function(response) {
    res.send(response.map((tweet) => {
      return tweet.text;
    }));
  })
  .catch((error) =>  {
    if (error.message) {
      res.status(401).send({message: '401 unauthorized', code: 401})
    } else {
      res.status(404).send({message: '404 not found', code: 404});
    }
  })
})

app.post('/analyze', function(req, res) {
  const options = {
    method: 'POST',
    uri: 'http://sentiment.vivekn.com/api/batch/',
    body: req.body,
    json: true,
    headers: {
        'Content-Type': 'application/json',
    },
    simple: false,
    resolveWithFullResponse: true
  }
  return request(options)
  .then(function(response) {
    res.status(200).json(response);
  })
  .catch(function(error) {
    console.log('an error occured analyzing tweet sentiments', error);
    res.send(error);
  })
})

app.listen(port, function () {
  console.log('Twitter sentiment back end listening on port 3000');
});
