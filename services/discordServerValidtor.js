const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

// Define Passport strategy
passport.use(
  new DiscordStrategy({
    clientID: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    callbackURL: "http://localhost:3000/auth/discord/callback",
    scope: ['identify', 'guilds']
  },
  (accessToken, refreshToken, profile, done) => {
    const user = { accessToken, refreshToken };
    done(null, user);
  })
);

// Define Passport serialization functions
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Define authentication route
router.get('/auth/discord', passport.authenticate('discord'));

// Define callback route
router.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/check-guild-membership');
  }
);

// Define guild membership check route
router.get('/check-guild-membership', async (req, res) => {
  const accessToken = req.user.accessToken;

  // Use the Discord API to get the user's guild memberships
  try {
    const guildsResponse = await axios.get(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Check if the user is a member of the specified guild
    // const guildId = '1020161024726421565'; // Replace with your own guild ID
    // const isJoined = guildsResponse.data.some((guild) => guild.id === guildId);

    // res.json({ isJoined });
    res.send('Success! You are a member of the guild.');
  } catch (error) {
    console.log("error on validating data",error);
    res.status(500).send('Failed to check guild membership');
  }
});

module.exports = router;
