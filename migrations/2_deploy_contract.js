const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer) {
  await deployer.deploy(Token);

  const accounts = await web3.eth.getAccounts();
  const FEE_ACCOUNT = accounts[0];
  const FEE_PERCENT = 1;
  
  await deployer.deploy(Exchange, FEE_ACCOUNT, FEE_PERCENT);
};
