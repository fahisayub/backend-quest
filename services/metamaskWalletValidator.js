const Web3 = require("web3");
  
  const metamaskValidator = async(message, signature, address ) =>{
    const web3 = new Web3(new Web3.providers.HttpProvider("https://api.avax-test.network/ext/bc/C/rpc"));

    const recoveredAddress = await web3.eth.accounts.recover(
      message,
      signature
    );
  
    if (address.toLowerCase() === recoveredAddress.toLowerCase()) {
      const obj = {
        message: "metamask Address Matched",
        address:address,
        status: 1,
        error: false,
      }
      return obj
    } else {
        const obj = {
            message: "metamask Address Not Matched",
            status: 1,
            error: true,
          }
          return obj
    }
  
  }
  const testFn = async(req,res)=> {
    console.log(req.body);
    res.send("success");
  }
  

  module.exports = {
    metamaskValidator,testFn
  }