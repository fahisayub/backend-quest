const express = require('express');
const OAuth = require('oauth-1.0a');
const CryptoJS = require('crypto-js');
const cors = require("cors")


const app = express();
app.options("", cors({ origin: '', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

const API_KEY = 'LuBXwVFRCfnZheQOoo5SKFG8m';
const API_SECRET_KEY = '4zL3tsFF75FqZboED63CR2GGGVPDbyutnlFR5chD8hQmZSc2vV';

const oauth = OAuth({
  consumer: {
    key: API_KEY,
    secret: API_SECRET_KEY,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (base_string, key) => {
    const signature = CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
    return signature;
  },
});

app.get('/', async (req, res) => {
  try {
    const request_data = {
      url: 'https://api.twitter.com/oauth/request_token',
      method: 'POST',
    };
    const headers = oauth.toHeader(oauth.authorize(request_data));
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    const response = await fetch(request_data.url, {
      method: request_data.method,
      headers,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    });
    const text = await response.text();
    const token = text
      .split('&')
      .find(str => str.startsWith('oauth_token='))
      .split('=')[1];
    const token_secret = text
      .split('&')
      .find(str => str.startsWith('oauth_token_secret='))
      .split('=')[1];
    res.send({ token, token_secret });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const port = 3009;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
