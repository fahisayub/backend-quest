// const Twit = require('twit');

// const oauthToken = 'Iz_3sAAAAAABmp6UAAABh5MSvUE';
// const oauthTokenSecret = 'aLEn4ixYM0HHFuudbCK2ozJORz95MVUQ';
// const oauthVerifier = 'gUT9eMTeKlYCyM04iGjIabchQC1gtrvT';
// const consumerKey = 'WZZYZu6tMUSQIEKkdp8YFWRCU';
// const consumerSecret = '94ExcdyHLBYg7h2iKEhcxtB5XDYo3oGasCjCUm5v1n80YRnfUm';

// const T = new Twit({
//   consumer_key: consumerKey,
//   consumer_secret: consumerSecret,
//   access_token: oauthToken,
//   access_token_secret: oauthTokenSecret,
// });

// T.post('oauth/access_token', { oauth_verifier: oauthVerifier }, (err, data, response) => {
//   if (err) {
//     console.error(err);
//   } else {
//     const accessToken = data.oauth_token;
//     const accessTokenSecret = data.oauth_token_secret;
//     console.log('Access token:', accessToken);
//     console.log('Access token secret:', accessTokenSecret);
//   }
// });

const Twit = require('twit');

const config = {
  consumer_key: 'WZZYZu6tMUSQIEKkdp8YFWRCU',
  consumer_secret: '94ExcdyHLBYg7h2iKEhcxtB5XDYo3oGasCjCUm5v1n80YRnfUm',
  access_token: '1440066097374371840-dxXgc0ZnXSQeR6B3b73jQdgUvjpwyH',
  access_token_secret: 'wccowKA1atenDWsVH0DLK8QZ5gRfWGBDs6SZZwu3W9bet',
};
const T = new Twit(config);

// const params = {
//   screen_name: 'username_of_user'
// };

// T.get('followers/list', function(err, data, response) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });

const params = {
  screen_name: 'twitter username', // replace with the username of the user whose latest tweet you want to fetch
  count: 1, // set the number of tweets you want to fetch
  tweet_mode: 'extended', // set tweet mode to extended to fetch full text of tweets
};

T.get('statuses/user_timeline', params, (err, data, response) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data[0]);
  }
});
