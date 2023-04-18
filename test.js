// discord server testing
const axios = require('axios');
const express = require('express');
const querystring = require('querystring');

const clientID = '1093225051781869668';
const clientSecret = 'dcPN59P2dj9hmHv4ABwGpgNBlJKlf28D';
const redirectURI = 'http://localhost:3034/auth/discord/callback';

const app = express();

// Redirect the user to the Discord authorization page
app.get('/auth/discord', (req, res) => {
  const scopes = ['identify', 'guilds'];
  const params = querystring.stringify({
    client_id: clientID,
    redirect_uri: redirectURI,
    response_type: 'code',
    scope: scopes.join(' '),
  });
  const authorizeURL = `https://discord.com/api/oauth2/authorize?${params}`;
  res.redirect(authorizeURL);
});

// Exchange the authorization code for an access token
app.get('/auth/discord/callback', async (req, res) => {
  console.log("callback recivied");
  console.log("callback data",req.query)
  const state = JSON.parse(req.query.state);
  console.log("state",state)
  const code = req.query.code;
  const tokenParams = {
    client_id: clientID,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectURI,
    scope: 'identify guilds',
  };
  const tokenHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', querystring.stringify(tokenParams), { headers: tokenHeaders });
  const accessToken = tokenResponse.data.access_token;
  console.log("access token is ",accessToken)
  res.send("ok");

  // // Use the access token to fetch the server invitation information
  // const inviteCode = 'pZRGtJfr'; // Replace with the server invitation code you want to check
  // const inviteResponse = await axios.get(`https://discord.com/api/invites/${inviteCode}`, {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // });
  // const serverID = inviteResponse.data.guild.id;
  // const userID = inviteResponse.data.inviter.id;

  // // Do something with the server and user IDs
  // console.log(`User ${userID} joined server ${serverID}`);
  // res.send(`User ${userID} joined server ${serverID}`);
});

app.listen(3034, () => console.log('Server started on port 3034'));
