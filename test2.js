const { default: axios } = require("axios");
const getData = async()=>{
const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', { headers: { 'Authorization': `Bearer ${"BY9LdB62AoRNHGwc8EKODT6477NNgT"}` } });
const guilds = guildsResponse.data;
const response = await axios.get(`https://discord.com/api/invites/${'pZRGtJfr'}`);
const data = response.data.guild.id;
const server = guilds.find(guild => guild.id == 123);
console.log(server);
}
getData()