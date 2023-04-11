const express = require('express');
const request = require('request');
const app = express();

const consumerKey = 'G0JVZB5t3dF6plaSNEHGdz8RE';
const consumerSecret = 'sibPFMeQ8JWCogWa1VRmaxkX5w2wzxgQkf9exg2dyGByR6DFK8';

app.post('/twitter-auth', (req, res) => {
  const oauthToken = req.body.oauthToken;
  const oauthTokenSecret = req.body.oauthTokenSecret;

  const options = {
    url: 'https://api.twitter.com/oauth/access_token',
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      token: oauthToken,
      token_secret: oauthTokenSecret
    }
  };

  request.post(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = new URLSearchParams(body);
      const accessToken = data.get('oauth_token');
      const accessTokenSecret = data.get('oauth_token_secret');
      // Use the accessToken and accessTokenSecret to authenticate the user in your backend
    } else {
      res.status(response.statusCode).send(body);
    }
  });
});

app.listen(3001, () => console.log('Express server is running on port 3001'));
