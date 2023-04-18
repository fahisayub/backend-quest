



const Twit = require('twit');

const getLetestRetweet = async (access_token, access_token_secret,url) => {
  console.log(url);
  const config = {
    consumer_key: 'WZZYZu6tMUSQIEKkdp8YFWRCU',
    consumer_secret: '94ExcdyHLBYg7h2iKEhcxtB5XDYo3oGasCjCUm5v1n80YRnfUm',
    access_token: access_token,
    access_token_secret: access_token_secret,
  };

  const T = new Twit(config);

  const params = {
    screen_name: 'twitter username', // replace with the username of the user whose latest tweet you want to fetch
    count: 1, // set the number of tweets you want to fetch
    tweet_mode: 'extended', // set tweet mode to extended to fetch full text of tweets
  };

  try {
    
    const match = url.match(/\/(\d+)(\?|$)/)[1];
    const tweetId = match;
    const { data } = await T.get('statuses/user_timeline', params);
    console.log(data[0].retweeted_status.id_str)
    console.log(tweetId,"tweet id");
    if (data[0].retweeted_status.id_str==tweetId) {
      console.log("tweeted");
      return true;
    } else {
      console.log("not tweeted")
      return false
    }
    
  } catch (err) {
    console.log(err);
  }
};

const getFollowerList = async (access_token, access_token_secret,profilLink) => {
  console.log("accses token",access_token,access_token_secret)
  const config = {
    consumer_key: 'WZZYZu6tMUSQIEKkdp8YFWRCU',
    consumer_secret: '94ExcdyHLBYg7h2iKEhcxtB5XDYo3oGasCjCUm5v1n80YRnfUm',
    access_token: access_token,
    access_token_secret: access_token_secret,
  };

  const T = new Twit(config);

  const params = {
    screen_name: "twitter username",
  };

  try {
    console.log("profilelink",profilLink);
    const username = profilLink.split('/').pop();
    console.log("usee name",username);
    const response = await T.get('friends/list');
    const following = response.data.users.map(user => user.screen_name);
    return following.includes(username);
  } catch (error) {
   
    
  }
};





module.exports={
  getLetestRetweet,
  getFollowerList
}
  