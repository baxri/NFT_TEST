var NftTest = artifacts.require("./NftTest.sol.sol");

module.exports = function (deployer) {
  deployer.deploy(
    NftTest,
    "Nft Test",
    "NFT_TEST",
    "https://storage.cloud.google.com/staging.test-b48f4.appspot.com/output/"
  );
};
