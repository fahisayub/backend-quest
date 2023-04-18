



const Twit = require('twit');

const getLetestRetweet = async (access_token, access_token_secret) => {
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
    const { data } = await T.get('statuses/user_timeline', params);
    return data[0].retweeted_status.id_str;
  } catch (err) {
    console.log(err);
  }
};

const getFollowerList = async (access_token, access_token_secret, screen_name,userName) => {
  const config = {
    consumer_key: 'WZZYZu6tMUSQIEKkdp8YFWRCU',
    consumer_secret: '94ExcdyHLBYg7h2iKEhcxtB5XDYo3oGasCjCUm5v1n80YRnfUm',
    access_token: access_token,
    access_token_secret: access_token_secret,
  };

  const T = new Twit(config);

  const params = {
    screen_name: screen_name,
  };

  try {
    const response = await T.get('friends/list', params);
    const following = response.data.users.map(user => user.screen_name);
    return following.includes("Theta_Network");
  } catch (error) {
    console.error(error);
    throw error;
  }
};





module.exports={
  getLetestRetweet,
  getFollowerList
}
  