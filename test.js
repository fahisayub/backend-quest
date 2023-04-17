const Twit = require('twit');
const axios = require('axios');
// const consumerKey = "1440066097374371840-tyYzOWfrvhrvgWXwk03GuURvw9CPuy"
// const secretKey = "kUPfH9SjsNQRq1RxhMf1JESLi3ieKH76Wi70aZlaDkQDx"
// const T = new Twit({
//   consumer_key: "6BIC3IXSEaS5s7XZp8Em5jsJa",
//   consumer_secret: "UkasFYNdehPs7Ix3ASzJClySMvXkeCNJrlX9VUxHn3nAqYxfM0",
//   access_token: consumerKey,
//   access_token_secret: secretKey,
// });


//   T.get('followers/ids', function(err, data, response) {
//     if (err) {
//       console.log(err);
//     } else {
//       const followerIds = data.ids;
//      console.log(followerIds)
//   }});

 

const bearerToken = '<your_bearer_token>';

const t = axios.get('https://api.twitter.com/2/users/by/username/:BitVenusNT', {
  headers: {
    Authorization: `Bearer ${'AAAAAAAAAAAAAAAAAAAAAJSemgEAAAAACdsOlOydqoE%2BJ9u3ohxJwrDW0IA%3DbjMuPrz8KtCFxfLiyVAnpsUYPepag2D2TDkIrHcdpa5ii1bYoM'}`,
  },
})
  .then((response) => {
    const isFollowing = response.data.data.public_metrics.following_count > 0;
    console.log('Is the user following the profile?', isFollowing);
  })
  .catch((error) => {
    console.error(error);
  });
