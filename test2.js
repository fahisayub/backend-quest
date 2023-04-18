const OAuth = require('oauth').OAuth;
const oauthToken = 'GTA5VgAAAAABmp6UAAABh5M6V94';
const oauthTokenSecret = '4o8fl1wp5PTU9iPQeNcEqTlyDg5IL3D8';
const oauthVerifier = 'SMVNzvgwy28YEY27ifYseWvXOrdADbgH';
const consumerKey = 'WZZYZu6tMUSQIEKkdp8YFWRCU';
const consumerSecret = '94ExcdyHLBYg7h2iKEhcxtB5XDYo3oGasCjCUm5v1n80YRnfUm';


const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  consumerKey,
  consumerSecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);

oauth.getOAuthAccessToken(
  oauthToken,
  oauthTokenSecret,
  oauthVerifier,
  function(error, accessToken, accessTokenSecret, results) {
    if (error) {
      console.error(error);
      return;
    }

    console.log(`Access token: ${accessToken}`);
    console.log(`Access token secret: ${accessTokenSecret}`);
  }
);
