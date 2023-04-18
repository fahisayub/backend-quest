const OAuth = require('oauth').OAuth;
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
const user_twitter_access_key = (oauthToken, oauthTokenSecret, oauthVerifier) => {
    return new Promise((resolve, reject) => {
      oauth.getOAuthAccessToken(
        oauthToken,
        oauthTokenSecret,
        oauthVerifier,
        (error, accessToken, accessTokenSecret, results) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            const obj = {
              accessToken: accessToken,
              accessTokenSecret: accessTokenSecret
            };
            console.log(`Access token: ${accessToken}`);
            console.log(`Access token secret: ${accessTokenSecret}`);
            resolve(obj);
          }
        }
      );
    });
  };
  

module.exports ={
    user_twitter_access_key
}
