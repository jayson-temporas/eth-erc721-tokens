const NftImage = artifacts.require("NftImage");

module.exports = function(deployer) {
  deployer.deploy(NftImage);
};
