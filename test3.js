const url = "https://twitter.com/BitVenusNFT/status/1638722233601253376?s=20";
const regex = /(\d+)/g;
const match = url.match(regex);
const tweetId = match[0];
console.log(match)
console.log(tweetId);