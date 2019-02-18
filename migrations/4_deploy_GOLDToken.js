const GOLDToken = artifacts.require("./GOLDToken.sol");
const SaveMath = artifacts.require("./zeppelin/contracts/math/SafeMath.sol");

module.exports = function(deployer, network, accounts) {
  let overwrite = true;
  var systemWallet = accounts[7]
  let tokenName = "RAX Mt.Fuji";
  let tokenSymbol = "FUJI";
  let publicDoc = 'https://tinyurl.com/RAXFuji';

  switch (network) {
    case 'development':
      overwrite = true;
      break;
    default:
        throw new Error ("Unsupported network");
  }

  deployer.then (async () => {
      await deployer.link(SaveMath, GOLDToken);
      return deployer.deploy(GOLDToken, tokenName, tokenSymbol, publicDoc, systemWallet, {overwrite: overwrite});
  }).then(() => {
      return GOLDToken.deployed();
  }).catch((err) => {
      console.error(err);
      process.exit(1);
  });
};
