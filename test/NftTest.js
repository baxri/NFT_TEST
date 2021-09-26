const NftTest = artifacts.require("./NftTest.sol");

contract("NftTest", (accounts) => {
  const tokenId = 4;
  const baseUrl =
    "https://storage.cloud.google.com/staging.test-b48f4.appspot.com/output/";

  it("...should initialize token.", async () => {
    const NftTestInstance = await NftTest.deployed();

    const name = await NftTestInstance.name();
    const symbol = await NftTestInstance.symbol();

    assert.equal(name, "Nft Test", "has initialized the name");
    assert.equal(symbol, "NFT_TEST", "has initialized the symbol");

    const tokenUri = await NftTestInstance.tokenURI(tokenId, {
      from: accounts[0],
    });

    assert.equal(
      tokenUri,
      `${baseUrl}${tokenId}.json`,
      "has initialized the tokenUri"
    );
  });
});
