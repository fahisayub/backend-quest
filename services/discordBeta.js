const axios = require("axios");
const querystring = require("querystring");
const { membersModel } = require("../models/membersModel");
const { jwtExtractor } = require("../middlewares/jwt");

const clientID = "1093225051781869668";
const clientSecret = "dcPN59P2dj9hmHv4ABwGpgNBlJKlf28D";
const redirectURI = "http://localhost:3034/auth/discord/callback";

const getUserKeyDiscord = async (req, res) => {
  console.log("callback recivied");
  console.log("callback data", req.query);
  const jwtToken = JSON.parse(req.query.state);
  console.log("state", state);
  const code = req.query.code;
  const tokenParams = {
    client_id: clientID,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectURI,
    scope: "identify guilds",
  };
  const tokenHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const tokenResponse = await axios.post(
    "https://discord.com/api/oauth2/token",
    querystring.stringify(tokenParams),
    { headers: tokenHeaders }
  );
  const accessToken = tokenResponse.data.access_token;
  const jwtData = jwtExtractor(jwtToken);
  const user = await membersModel.findByIdAndUpdate(jwtData.id,{$set:{discordAuth:{accessKey:accessToken,status:true}}});
  console.log("access token is ", accessToken);
  res.send("ok");
};

const getDiscordAuthUrl=async(req,res)=>{

}

const getServerJoinedStatus = async (userKey, invitationUrl) => {
  const guildsResponse = await axios.get(
    "https://discord.com/api/users/@me/guilds",
    { headers: { Authorization: `Bearer ${"BY9LdB62AoRNHGwc8EKODT6477NNgT"}` } }
  );
  const guilds = guildsResponse.data;
  const response = await axios.get(
    `https://discord.com/api/invites/${"pZRGtJfr"}`
  );
  const data = response.data.guild.id;
  const server = guilds.find((guild) => guild.id == 123);
  console.log(server);
};

module.exports = { getUserKeyDiscord, getServerJoinedStatus };
