const axios = require("axios");
const querystring = require("querystring");
const { membersModel } = require("../models/membersModel");
const { jwtExtractor } = require("../middlewares/jwt");

const clientID = "1093225051781869668";
const clientSecret = "dcPN59P2dj9hmHv4ABwGpgNBlJKlf28D";
const redirectURI = "https://questbackend.onrender.com/user/dicordCallback";

const getUserKeyDiscord = async (req, res) => {
  console.log("callback recivied");
  console.log("callback data", req.query);
  const jwt = JSON.parse(req.query.state);
  const jwtToken = jwt.replace(/'/g, '');
  console.log("jwt token",jwtToken);
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
  const jwtData = await jwtExtractor(jwtToken);
  console.log(jwtData.id);
  const user = await membersModel.findByIdAndUpdate(jwtData.id,{$set:{discordAuth:{accessKey:accessToken,status:true}}});
  console.log("access token is ", accessToken);
  res.redirect("https://questapp.netlify.app/MyQuest");
};

const getDiscordAuthUrl=async()=>{
 return 'https://discord.com/api/oauth2/authorize?client_id=1093225051781869668&redirect_uri=http%3A%2F%2F31.220.48.246%3A4000%2Fuser%2FdicordCallback&response_type=code&scope=identify%20guilds%20guilds.join%20connections%20guilds.members.read'}

const getServerJoinedStatus = async (userKey, invitationUrl) => {
  const key = userKey
  console.log("input invitation url",invitationUrl)
  const inviteId = invitationUrl.match(/discord\.gg\/(\w+)/)[1];
  console.log(inviteId); // prints "pZRGtJfr"
  
  const guildsResponse = await axios.get(
    "https://discord.com/api/users/@me/guilds",
    { headers: { Authorization: `Bearer ${key}` } }
  );
  let data;
  const guilds = guildsResponse.data;
  try {
    const response = await axios.get(
      `https://discord.com/api/invites/${inviteId}`
    );
     data = response.data.guild.id;
  } catch (error) {
    console.log("disord error")
  }
  const server = guilds.find((guild) => guild.id == data);
 if (server===undefined) {
  return false;
 } else {
  return true
 }
};

module.exports = { getUserKeyDiscord, getServerJoinedStatus,getDiscordAuthUrl };
